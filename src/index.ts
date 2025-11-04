/*import { helloWorld } from './hello-world';

const greet = helloWorld();
console.log(greet);
*/

// 1) importe Express (le mini framework web) et systeminformation (la lib qui lit les infos machine)
import express from "express";
import * as si from "systeminformation";

// 2)  définit ISystemInformation 
type ISystemInformation = {
     cpu: si.Systeminformation.CpuData;
     system: si.Systeminformation.SystemData;
     mem: si.Systeminformation.MemData;
     os: si.Systeminformation.OsData;
     currentLoad: si.Systeminformation.CurrentLoadData;
     processes: si.Systeminformation.ProcessesData;
     diskLayout: si.Systeminformation.DiskLayoutData[];
     networkInterfaces: si.Systeminformation.NetworkInterfacesData[]; // on normalise en tableau
   };

// 3) fonction qui récupère les infos une par une 
async function getSystemInformation(): Promise<ISystemInformation> {
  // On appelle les fonctions de systeminformation de façon séquentielle (plus facile à lire)
  const cpu = await si.cpu();
  const system = await si.system();
  const mem = await si.mem();
  const os = await si.osInfo();
  const currentLoad = await si.currentLoad();
  const processes = await si.processes();
  const diskLayout = await si.diskLayout();
  const nics = await si.networkInterfaces();

  // On s’assure que les interfaces réseau soient un tableau
  const networkInterfaces = Array.isArray(nics) ? nics : [nics];

  // On renvoie un objet avec toutes les infos attendues
  return { cpu, system, mem, os, currentLoad, processes, diskLayout, networkInterfaces };
}

// 4) On crée l’app Express et on choisit un port
const app = express();
const PORT = 8000;

// 5) On crée la route demandée par le TD:
//    GET /api/v1/sysinfo qui renvoie les infos système en JSON
app.get("/api/v1/sysinfo", async (_req, res) => {
  try {
    const info = await getSystemInformation();
    res.status(200).json({
  ...info,
  test:"New Content Added ......",
  }); 
  } catch (e) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 6) Toute autre route 404
app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

// 7) On démarre le serveur
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}/api/v1/sysinfo`);
  });
}

// On exporte app pour écrire des tests avec supertest plus tard
export { app };
export {getSystemInformation};