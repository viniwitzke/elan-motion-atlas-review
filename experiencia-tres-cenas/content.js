export const cfg=window.ELAN_CLIENTE;
export const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function validate(c){
 const asset=s=>{if(s&&!/^assets\/[\w./-]+\.(jpg|jpeg|png|webp|svg|mp4|webm|woff2)$/i.test(s))throw Error('Mídia deve ser um arquivo local em assets/: '+s);if(s?.includes('..'))throw Error('Caminho de mídia inválido')};
 if(!c.marca||!c.hero||!c.filosofia[c.filosofiaTipo])throw Error('Marca, hero e filosofia são obrigatórios');
 asset(c.hero.poster);asset(c.hero.video);asset(c.logo);asset(c.fontFile);
 for(const list of [c.tratamentos,c.diferenciais]){if(!Array.isArray(list)||!list.length||list.length>30)throw Error('Listas precisam de 1 a 30 itens');for(const item of list){asset(item.image);if(!(item.title||item.nome))throw Error('Item sem título')}}
 const editorial=c.historia.mode==='editorial';
 if(editorial){
  for(const key of ['origin','intro','today','present'])if(typeof c.historia[key]!=='string'||!c.historia[key].trim())throw Error('Modo editorial precisa de '+key);
  if(!c.historia.coverImage||!c.historia.presentImage)throw Error('Modo editorial precisa das fotografias de abertura e presente');
  asset(c.historia.coverImage);asset(c.historia.presentImage);
 }else{
  const list=c.historia.milestones;if(!Array.isArray(list)||!list.length||list.length>30)throw Error('Timeline precisa de 1 a 30 marcos');for(const item of list){asset(item.image);if(!item.title)throw Error('Marco sem título')}
 }
 for(const v of Object.values(c.filosofia))asset(v.image);
 for(const t of c.tratamentos)if(typeof t.text!=='string'||!t.text.trim())throw Error('Tratamento precisa de descrição');
 if(c.whatsapp.numero&&!/^\d{10,15}$/.test(c.whatsapp.numero))throw Error('WhatsApp deve conter DDI e apenas números');
 for(const v of Object.values(c.identity||{}))if(!/^#[\da-f]{3,8}$/i.test(v))throw Error('Cor deve ser hexadecimal');
 return c;
}
