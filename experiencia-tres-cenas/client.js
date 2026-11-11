/* Dados ilustrativos. Substituir apenas com dados verificados do cliente. */
window.ELAN_CLIENTE = ({
  marca: 'ÉLAN', subtituloMarca: 'WELLNESS ATELIER',
  slogan: '', // demonstração; nunca publicar sem aprovação
  hero: {poster:'assets/approved-poster-hero-estudo.jpg', video:null, variant:'a'},
  whatsapp: {numero:'', mensagem:'Olá! Gostaria de saber mais sobre os serviços.'},
  filosofia: {
    ambiente:{image:'assets/approved-building.jpg',alt:'Fotografia de estudo de ambiente', tipo:'ambiente', x:57,y:50, titulo:['O cuidado','começa no <em>encontro.</em>'], descricao:'Um espaço que recebe, acolhe e aproxima. A experiência começa antes mesmo do primeiro atendimento.'},
    retrato:{image:'assets/approved-ritual.jpg',alt:'Fotografia de estudo de retrato', tipo:'retrato', x:53,y:45, titulo:['O valor está','nas <em>pessoas.</em>'], descricao:'Uma apresentação mais humana, com o rosto e a história das pessoas por trás de cada atendimento.'},
    detalhe:{image:'assets/approved-room.jpg',alt:'Fotografia de estudo de detalhe de ambiente', tipo:'detalhe', x:69,y:50, titulo:['O essencial','está nos <em>detalhes.</em>'], descricao:'Uma fotografia de detalhe pode apresentar o espaço sem depender de um retrato encenado.'}
  }
});

window.ELAN_CLIENTE.filosofiaTipo='ambiente';

window.ELAN_CLIENTE.historia={
  "clientName": "Nova Forma (caso de teste)",
  "intro": "Uma história feita por pessoas.",
  "origin": "Aqui tudo começa.",
  "today": "Uma trajetória de dedicação à beleza, à saúde e ao atendimento individualizado.",
  "present": "Fundada em 1994, a Nova Forma passou por ampliações, conquistou sede própria, desenvolveu protocolos exclusivos e mudou para seu endereço atual em 2017.",
  "coverImage": "assets/pavilion.jpg",
  "presentImage": "assets/people.jpg",
  "photoNote": "Fotografias ilustrativas · linha do tempo demonstrativa (caso Nova Forma)",
  "milestones": [
    {
      "date": "1994",
      "title": "O começo de uma trajetória",
      "text": "As atividades começaram em um espaço pequeno e simples em Balneário Camboriú. Muitas das primeiras clientes continuaram sendo atendidas pela clínica.",
      "image": "assets/pavilion.jpg",
      "imageAlt": "Imagem ilustrativa do estudo de movimento; não corresponde ao ano 1994"
    },
    {
      "date": "1996",
      "title": "O primeiro crescimento",
      "text": "O crescimento levou à ampliação do espaço físico, da equipe e das opções de tratamentos.",
      "image": "assets/room.jpg",
      "imageAlt": "Imagem ilustrativa do estudo de movimento; não corresponde ao ano 1996"
    },
    {
      "date": "2002",
      "title": "Uma sede própria",
      "text": "A clínica adquiriu sua sede própria, com espaço maior e ambientes planejados para as necessidades das clientes.",
      "image": "assets/building.jpg",
      "imageAlt": "Imagem ilustrativa do estudo de movimento; não corresponde ao ano 2002"
    },
    {
      "date": "2009",
      "title": "Mais espaço para atender",
      "text": "A demanda motivou outra ampliação das instalações e dos serviços de estética, saúde e bem-estar.",
      "image": "assets/people.jpg",
      "imageAlt": "Imagem ilustrativa do estudo de movimento; não corresponde ao ano 2009"
    },
    {
      "date": "2014",
      "title": "Uma nova forma de cuidar",
      "text": "A empresa reformulou sua abordagem de atendimento, valorizando uma relação mais próxima e individual e desenvolvendo protocolos exclusivos.",
      "image": "assets/ritual.jpg",
      "imageAlt": "Imagem ilustrativa do estudo de movimento; não corresponde ao ano 2014"
    },
    {
      "date": "2017",
      "title": "Um novo endereço",
      "text": "A clínica passou a funcionar no endereço atual, com salas diferenciadas, tratamentos exclusivos e equipamentos modernos.",
      "image": "assets/lake.jpg",
      "imageAlt": "Imagem ilustrativa do estudo de movimento; não corresponde ao ano 2017"
    }
  ]
};
Object.assign(window.ELAN_CLIENTE,{
 study:true,
 logo:null,fontFile:null,
 identity:{forest:'#153428',paper:'#ebe6d9',gold:'#bfa682'},
 comercial:{endereco:'',horario:''},
 seo:{url:'',cidade:'',description:'ÉLAN — experiências de cuidado, tratamentos e histórias. Template demonstrativo da NPE Factory.'},
 footer:{eyebrow:'SEU PRÓXIMO MOMENTO COMEÇA AQUI',title:'O cuidado também é um convite.',text:'Veja os tratamentos e fale com a equipe.'},
 differentialsIntro:'Pessoas, ambientes e experiências. Conteúdos demonstrativos a substituir pelos diferenciais comprovados de cada cliente.',
 tratamentos:[
  {nome:'Tratamento 01',category:'Facial',image:'assets/room.jpg',alt:'Fotografia ilustrativa de ambiente',text:'Imagem, nome e descrição reais deste tratamento serão fornecidos pelo cliente.'},
  {nome:'Tratamento 02',category:'Corporal',image:'assets/lake.jpg',alt:'Fotografia ilustrativa de paisagem',text:'Descrição demonstrativa, com informações a confirmar pelo cliente.'},
  {nome:'Tratamento 03',category:'Bem-estar',image:'assets/people.jpg',alt:'Fotografia ilustrativa de pessoas',text:'Texto demonstrativo; o cliente descreve o cuidado com as próprias palavras.'},
  {nome:'Tratamento 04',category:'Facial',image:'assets/pavilion.jpg',alt:'Fotografia ilustrativa de arquitetura',text:'Conheça o tratamento e converse com a equipe sobre suas necessidades.'},
  {nome:'Tratamento 05',category:'Bem-estar',image:'assets/ritual.jpg',alt:'Fotografia ilustrativa de ritual',text:'Conteúdo comercial sujeito à confirmação e aprovação do cliente.'}
 ],
 diferenciais:[
  {title:'Pessoas',image:'assets/people.jpg',alt:'Pessoas em imagem de estudo',text:'Histórias e equipe, com imagens e informações reais do cliente.'},
  {title:'Ambientes',image:'assets/room.jpg',alt:'Ambiente em imagem de estudo',text:'Estrutura, conforto e detalhes verificáveis do espaço.'},
  {title:'Experiência',image:'assets/ritual.jpg',alt:'Experiência em imagem de estudo',text:'Aquilo que diferencia o atendimento e os cuidados.'}
 ]
});

