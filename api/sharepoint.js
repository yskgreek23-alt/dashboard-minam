const FILES_MAP = {
  resumen005: [
    'Resumen_SIAF_Pliego_Gasto.xlsx',
    'Resumen_SIAF_Pliego_Gasto',
  ],
  datos_abiertos: [
    'RESUMEN_BD_DATOS_ABIERTOS_MINAM.xlsx',
    'RESUMEN_BD_DATOS_ABIERTOS_MINAM',
    'Consolidado_SIAF_Pliego_Gasto.xlsx',
  ],
  gob_nacional: [
    'resumen_ejecucion_gobierno_nacional.xlsx',
    'resumen_ejecucion_gobierno_nacional',
  ],
};

export default async function handler(req, res) {
  try {
    const key = req.query.file || 'resumen005';
    const { TENANT_ID, CLIENT_ID, CLIENT_SECRET } = process.env;

    const tokenRes = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: 'https://graph.microsoft.com/.default',
        grant_type: 'client_credentials',
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('Error de autenticación con Microsoft Graph');

    const headers = { Authorization: `Bearer ${tokenData.access_token}` };
    const siteRes = await fetch(
      'https://graph.microsoft.com/v1.0/sites/datascientist23.sharepoint.com:/sites/BASEDEDATOS-DASHBOARDMINAM',
      { headers }
    );
    const siteData = await siteRes.json();
    const siteId = siteData.id;

    const candidates = FILES_MAP[key] || [key];

    for (const fileName of candidates) {
      const cleanName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
      const directUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root:/${encodeURIComponent(cleanName)}:/content`;
      const fileRes = await fetch(directUrl, { headers });
      if (fileRes.ok) {
        const buf = await fileRes.arrayBuffer();
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('X-File-Name', encodeURIComponent(cleanName));
        return res.status(200).send(Buffer.from(buf));
      }
    }

    for (const fileName of candidates) {
      const baseQuery = fileName.replace(/\.xlsx$/i, '');
      const sRes = await fetch(
        `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root/search(q='${encodeURIComponent(baseQuery)}')`,
        { headers }
      );
      if (sRes.ok) {
        const sData = await sRes.json();
        const match = (sData.value || []).find((it) =>
          String(it.name || '').toUpperCase().includes(baseQuery.toUpperCase())
        );
        if (match?.id) {
          const dlRes = await fetch(
            `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${match.id}/content`,
            { headers }
          );
          if (dlRes.ok) {
            const buf = await dlRes.arrayBuffer();
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('X-File-Name', encodeURIComponent(match.name));
            return res.status(200).send(Buffer.from(buf));
          }
        }
      }
    }

    return res.status(404).json({ error: `No se encontró ${key} en SharePoint.` });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}