import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const FILES_MAP: Record<string, string[]> = {
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

async function fetchFromSharePoint(key: string, env: Record<string, string>) {
  const { TENANT_ID, CLIENT_ID, CLIENT_SECRET } = env;
  if (!TENANT_ID || !CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('Faltan credenciales en .env');
  }

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
  if (!tokenData.access_token) throw new Error('No se pudo autenticar con Microsoft Graph.');
  const headers = { Authorization: `Bearer ${tokenData.access_token}` };

  const siteRes = await fetch(
    'https://graph.microsoft.com/v1.0/sites/datascientist23.sharepoint.com:/sites/BASEDEDATOS-DASHBOARDMINAM',
    { headers }
  );
  if (!siteRes.ok) throw new Error('No se encontró el sitio SharePoint.');
  const siteData = await siteRes.json();
  const siteId = siteData.id;

  const candidates = FILES_MAP[key] || [key];

  for (const fileName of candidates) {
    const cleanName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`;
    const directUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root:/${encodeURIComponent(cleanName)}:/content`;
    const fileRes = await fetch(directUrl, { headers });
    if (fileRes.ok) {
      return { buffer: await fileRes.arrayBuffer(), fileName: cleanName };
    }
  }

  for (const fileName of candidates) {
    const baseQuery = fileName.replace(/\.xlsx$/i, '');
    const searchUrl = `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/root/search(q='${encodeURIComponent(baseQuery)}')`;
    const sRes = await fetch(searchUrl, { headers });
    if (sRes.ok) {
      const sData = await sRes.json();
      const match = (sData.value || []).find((it: any) =>
        String(it.name || '').toUpperCase().includes(baseQuery.toUpperCase())
      );
      if (match?.id) {
        const dlRes = await fetch(
          `https://graph.microsoft.com/v1.0/sites/${siteId}/drive/items/${match.id}/content`,
          { headers }
        );
        if (dlRes.ok) {
          return { buffer: await dlRes.arrayBuffer(), fileName: match.name };
        }
      }
    }
  }

  throw new Error(`Archivo no encontrado en SharePoint: ${key}`);
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'sharepoint-proxy',
        configureServer(server) {
          server.middlewares.use('/api/sharepoint', async (req, res) => {
            try {
              const urlObj = new URL(req.url || '', 'http://localhost');
              const key = urlObj.searchParams.get('file') || 'resumen005';
              const { buffer, fileName } = await fetchFromSharePoint(key, env);
              res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
              res.setHeader('X-File-Name', encodeURIComponent(fileName));
              res.statusCode = 200;
              res.end(Buffer.from(buffer));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        },
      },
    ],
  };
});