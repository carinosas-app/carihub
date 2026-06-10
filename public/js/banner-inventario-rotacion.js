(function(){
  const INVENTARIO_DIARIO_BASE={
    home_izquierda:420,
    home_derecha:420,
    home_inferior:360,
    home_categorias:650,
    home_hero_1:1200,
    home_hero_2:1200,
    home_hero_3:1200,
    home_hero_4:1200,
    home_hero_5:1200,
    resultados_izquierda:280,
    resultados_centro:340,
    resultados_derecha:280,
    resultados_inferior:220,
    perfil_izquierda:260,
    perfil_centro:320,
    perfil_derecha:260,
    perfil_inferior:210
  };

  const NOMBRES_ZONA={
    home_izquierda:"Home — izquierda superior",
    home_derecha:"Home — derecha superior",
    home_inferior:"Home — inferior",
    home_categorias:"Home — selector de categorías",
    home_hero_1:"Home — hero imagen 1",
    home_hero_2:"Home — hero imagen 2",
    home_hero_3:"Home — hero imagen 3",
    home_hero_4:"Home — hero imagen 4",
    home_hero_5:"Home — hero imagen 5",
    resultados_izquierda:"Resultados — izquierda superior",
    resultados_centro:"Resultados — centro superior",
    resultados_derecha:"Resultados — derecha superior",
    resultados_inferior:"Resultados — inferior",
    perfil_izquierda:"Perfil — izquierda superior",
    perfil_centro:"Perfil — centro superior",
    perfil_derecha:"Perfil — derecha superior",
    perfil_inferior:"Perfil — inferior"
  };

  function formatearApariciones(valor){
    const numero=Math.max(0,Number(valor)||0);
    return numero.toLocaleString("es-MX");
  }

  function textoRotacion(capacidad,slotId){
    const cap=Math.max(1,Number(capacidad)||1);
    if(slotId==="home_categorias"){
      return "Espacio único en toda la plataforma: 1 banner en elegir categoría";
    }
    if(/^home_hero_\d+$/.test(slotId)){
      return "Espacio exclusivo del hero superior: 1 anuncio activo en esta posición";
    }
    if(/^home_(izquierda|derecha|inferior)$/.test(slotId)){
      return "Espacio único en home: no depende de la categoría de la búsqueda";
    }
    if(cap===1)return "Espacio exclusivo: 1 anuncio activo a la vez";
    return "Rotación entre "+cap+" espacios activos en esta zona";
  }

  function calcularApariciones(slotId,capacidad){
    const base=INVENTARIO_DIARIO_BASE[slotId]||300;
    const cap=Math.max(1,Number(capacidad)||1);
    const dia=Math.max(1,Math.round(base/cap));
    return {
      dia,
      quincena:dia*15,
      mes:dia*30
    };
  }

  function actualizarPanel(ids,slotId,capacidad){
    const box=document.getElementById(ids?.box||"");
    if(!box)return;

    if(!slotId){
      box.classList.add("oculto");
      return;
    }

    const apariciones=calcularApariciones(slotId,capacidad);
    const zona=document.getElementById(ids.zona||"");
    const rotacion=document.getElementById(ids.rotacion||"");
    const dia=document.getElementById(ids.dia||"");
    const quincena=document.getElementById(ids.quincena||"");
    const mes=document.getElementById(ids.mes||"");

    box.classList.remove("oculto");
    if(zona)zona.textContent=NOMBRES_ZONA[slotId]||slotId;
    if(rotacion)rotacion.textContent=textoRotacion(capacidad,slotId);
    if(dia)dia.textContent=formatearApariciones(apariciones.dia);
    if(quincena)quincena.textContent=formatearApariciones(apariciones.quincena);
    if(mes)mes.textContent=formatearApariciones(apariciones.mes);
  }

  window.BannerInventarioRotacion={
    INVENTARIO_DIARIO_BASE,
    calcularApariciones,
    actualizarPanel
  };
})();
