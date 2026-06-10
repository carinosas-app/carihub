(function(){
  const CATEGORIAS=[
    {id:"escort",nombre:"Escort",emoji:"",label:"Escort"},
    {id:"escort gay",nombre:"Escort Gay",emoji:"",label:"Escort Gay"},
    {id:"escort vip",nombre:"Escort VIP",emoji:"",label:"Escort VIP"},
    {id:"edecan",nombre:"Edecán",emoji:"",label:"Edecán"},
    {id:"stripper",nombre:"Stripper",emoji:"",label:"Stripper"},
    {id:"modelos",nombre:"Modelos",emoji:"",label:"Modelos"},
    {id:"gigolo",nombre:"Gigoló",emoji:"",label:"Gigoló"},
    {id:"acompanante",nombre:"Acompañante",emoji:"",label:"Acompañante"},
    {id:"petit",nombre:"Petit",emoji:"",label:"Petit"},
    {id:"contenido",nombre:"Contenido",emoji:"",label:"Contenido"},
    {id:"tabledance",nombre:"Tabledance",emoji:"",label:"Tabledance"},
    {id:"sex shop",nombre:"Sex Shop",emoji:"",label:"Sex Shop"},
    {id:"spa",nombre:"Spa",emoji:"",label:"Spa"},
    {id:"masajes",nombre:"Masajes",emoji:"",label:"Masajes"},
    {id:"club sw",nombre:"Club SW",emoji:"",label:"Club SW"},
    {id:"antro restaurant bar",nombre:"Antro / Restaurant Bar",emoji:"",label:"Antro / Restaurant Bar"},
    {id:"antro restaurant bar lgbt",nombre:"Antro / Restaurant Bar LGBT",emoji:"",label:"Antro / Restaurant Bar LGBT"},
    {id:"hotel motel",nombre:"Hotel / Motel",emoji:"",label:"Hotel / Motel"},
    {id:"cabinas glory holes",nombre:"Cabinas / Glory Holes",emoji:"",label:"Cabinas / Glory Holes"},
    {id:"trans",nombre:"Trans",emoji:"",label:"Trans"},
    {id:"femboy",nombre:"Femboy",emoji:"",label:"Femboy"},
    {id:"swinger",nombre:"Swinger",emoji:"",label:"Swinger"},
    {id:"unicorns",nombre:"Unicorns",emoji:"",label:"Unicorns"},
    {id:"cuckold hotwife",nombre:"Cuckold / Hotwife",emoji:"",label:"Cuckold / Hotwife"},
    {id:"singles",nombre:"Singles",emoji:"",label:"Singles"},
    {id:"hotwife",nombre:"Hotwife",emoji:"",label:"Hotwife"},
    {id:"lesbians",nombre:"Lesbians",emoji:"",label:"Lesbians"},
    {id:"tom boy",nombre:"Tom Boy",emoji:"",label:"Tom Boy"},
    {id:"tom fem",nombre:"Tom Fem",emoji:"",label:"Tom Fem"},
    {id:"dotados",nombre:"Dotados",emoji:"",label:"Dotados"},
    {id:"fetiche",nombre:"Fetiche",emoji:"",label:"Fetiche"},
    {id:"sado",nombre:"Sado",emoji:"",label:"Sado"},
    {id:"dominatrix",nombre:"Dominatrix",emoji:"",label:"Dominatrix"},
    {id:"cine xxx",nombre:"Cine XXX",emoji:"",label:"Cine XXX"}
  ];

  const ALIASES={
    "escort gay":"escort gay",
    "escort vip":"escort vip",
    "sex shop":"sex shop",
    "sexshop":"sex shop",
    "gigolo":"gigolo",
    "gigolo":"gigolo",
    "striper":"stripper",
    "hotwife cuckcold":"cuckold hotwife",
    "hotwife cuckold":"cuckold hotwife",
    "cuckold hotwife":"cuckold hotwife",
    "bar lgbtiq":"antro restaurant bar lgbt",
    "bar lgbtiq+":"antro restaurant bar lgbt",
    "antro restaurant bar lgbt":"antro restaurant bar lgbt",
    "hotel":"hotel motel",
    "motel":"hotel motel",
    "hotel motel":"hotel motel",
    "cabinas glory holes":"cabinas glory holes",
    "cine xxx":"cine xxx",
    "dominatix":"dominatrix"
  };

  function limpiarTexto(valor){
    return String(valor||"")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Symbol}\uFE0F\u200D]/gu," ")
      .replace(/[^\p{Letter}\p{Number}\s/+-]/gu," ")
      .replace(/[\/+-]+/g," ")
      .replace(/\s+/g," ")
      .trim();
  }

  function normalizarCategoria(valor){
    const limpio=limpiarTexto(valor);
    return ALIASES[limpio]||limpio;
  }

  function categoriaPorValor(valor){
    const id=normalizarCategoria(valor);
    return CATEGORIAS.find(categoria=>categoria.id===id)||null;
  }

  function categorias(){
    return CATEGORIAS.map(categoria=>({...categoria}));
  }

  function idCategoria(valor){
    const categoria=categoriaPorValor(valor);
    return categoria?.id||normalizarCategoria(valor);
  }

  function labelCategoria(valor){
    const categoria=categoriaPorValor(valor);
    return categoria?.label||String(valor||"").trim();
  }

  window.CATALOGO_CATEGORIAS_CARIHUB=categorias();
  window.CariHubCatalogos={
    categorias,
    normalizarCategoria,
    labelCategoria,
    idCategoria
  };
})();
