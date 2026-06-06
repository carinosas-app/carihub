(function(){
  const CONFIG_PRECIOS_PUBLICIDAD_FALLBACK={
    ivaIncluido:true,
    moneda:"MXN",
    redondeo:50,
    factoresPeriodo:{semanal:0.35,quincenal:0.65,mensual:1},
    factoresAutomaticos:{imagenSemanal:0.35,imagenQuincenal:0.65,imagenMensual:1,video:2},
    multiplicadoresTipo:{imagen:1,video:2},
    slots:{
      home_izquierda:{nombre:"Home izquierda superior",pantalla:"home",espacio:"izquierda",capacidadMaxima:2,precioMensualImagenBase:1300,activo:true},
      home_derecha:{nombre:"Home derecha superior",pantalla:"home",espacio:"derecha",capacidadMaxima:2,precioMensualImagenBase:1300,activo:true},
      home_inferior:{nombre:"Home inferior",pantalla:"home",espacio:"inferior",capacidadMaxima:3,precioMensualImagenBase:850,activo:true},
      resultados_izquierda:{nombre:"Resultados izquierda superior",pantalla:"resultados",espacio:"izquierda",capacidadMaxima:3,precioMensualImagenBase:500,activo:true},
      resultados_centro:{nombre:"Resultados centro superior",pantalla:"resultados",espacio:"centro",capacidadMaxima:2,precioMensualImagenBase:600,activo:true},
      resultados_derecha:{nombre:"Resultados derecha superior",pantalla:"resultados",espacio:"derecha",capacidadMaxima:3,precioMensualImagenBase:500,activo:true},
      resultados_inferior:{nombre:"Resultados inferior",pantalla:"resultados",espacio:"inferior",capacidadMaxima:3,precioMensualImagenBase:350,activo:true},
      perfil_izquierda:{nombre:"Perfil izquierda superior",pantalla:"perfil",espacio:"izquierda",capacidadMaxima:3,precioMensualImagenBase:500,activo:true},
      perfil_centro:{nombre:"Perfil centro superior",pantalla:"perfil",espacio:"centro",capacidadMaxima:2,precioMensualImagenBase:600,activo:true},
      perfil_derecha:{nombre:"Perfil derecha superior",pantalla:"perfil",espacio:"derecha",capacidadMaxima:3,precioMensualImagenBase:500,activo:true},
      perfil_inferior:{nombre:"Perfil inferior",pantalla:"perfil",espacio:"inferior",capacidadMaxima:3,precioMensualImagenBase:350,activo:true}
    }
  };

  function preciosManualVacioPublicidad(){
    return {
      imagen:{semanal:0,quincenal:0,mensual:0},
      video:{semanal:0,quincenal:0,mensual:0}
    };
  }

  function obtenerPrecioMensualImagenBaseSlot(slot){
    return Number(slot?.automatico?.precioMensualImagenBase||slot?.precioMensualImagenBase)||0;
  }

  function normalizarFactoresAutomaticosPublicidad(fuente){
    const factoresPeriodo=fuente?.factoresPeriodo||{};
    const factoresAutomaticos=fuente?.factoresAutomaticos||{};
    const multiplicadoresTipo=fuente?.multiplicadoresTipo||{};
    return {
      imagenSemanal:Number(factoresAutomaticos.imagenSemanal||factoresPeriodo.semanal)||0.35,
      imagenQuincenal:Number(factoresAutomaticos.imagenQuincenal||factoresPeriodo.quincenal)||0.65,
      imagenMensual:Number(factoresAutomaticos.imagenMensual||factoresPeriodo.mensual)||1,
      video:Number(factoresAutomaticos.video||multiplicadoresTipo.video)||2
    };
  }

  function normalizarSlotPrecioPublicidad(slot,slotId){
    const base=obtenerPrecioMensualImagenBaseSlot(slot);
    const modo=slot?.modoPrecio==="manual"?"manual":"automatico";
    const manualVacio=preciosManualVacioPublicidad();
    return {
      ...(slot||{}),
      nombre:slot?.nombre||slotId,
      capacidadMaxima:Number(slot?.capacidadMaxima)||1,
      precioMensualImagenBase:base,
      modoPrecio:modo,
      automatico:{...(slot?.automatico||{}),precioMensualImagenBase:base},
      manual:{
        ...manualVacio,
        ...(slot?.manual||{}),
        imagen:{...manualVacio.imagen,...(slot?.manual?.imagen||{})},
        video:{...manualVacio.video,...(slot?.manual?.video||{})}
      }
    };
  }

  function normalizarConfigPreciosPublicidad(data){
    const fuente=data&&typeof data==="object"?data:{};
    const factoresAutomaticos=normalizarFactoresAutomaticosPublicidad({
      ...CONFIG_PRECIOS_PUBLICIDAD_FALLBACK,
      ...fuente
    });
    const slotsFuente={
      ...CONFIG_PRECIOS_PUBLICIDAD_FALLBACK.slots,
      ...(fuente.slots||{})
    };
    const slots={};
    Object.entries(slotsFuente).forEach(([slotId,slot])=>{
      slots[slotId]=normalizarSlotPrecioPublicidad(slot,slotId);
    });
    return {
      ...CONFIG_PRECIOS_PUBLICIDAD_FALLBACK,
      ...fuente,
      factoresPeriodo:{
        ...CONFIG_PRECIOS_PUBLICIDAD_FALLBACK.factoresPeriodo,
        ...(fuente.factoresPeriodo||{})
      },
      factoresAutomaticos,
      multiplicadoresTipo:{
        ...CONFIG_PRECIOS_PUBLICIDAD_FALLBACK.multiplicadoresTipo,
        ...(fuente.multiplicadoresTipo||{})
      },
      slots
    };
  }

  function normalizarTextoPrecioScope(valor){
    return String(valor||"")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g,"")
      .replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}\p{Symbol}\uFE0F\u200D]/gu," ")
      .replace(/[^\p{Letter}\p{Number}\s/.-]/gu," ")
      .replace(/\s+/g," ")
      .trim();
  }

  function listaDisplayPrecioScope(valor){
    if(Array.isArray(valor))return valor.map(item=>String(item||"").trim()).filter(Boolean);
    const texto=String(valor||"").trim();
    return texto?[texto]:[];
  }

  function normalizarListaPrecioScope(valor){
    return listaDisplayPrecioScope(valor).map(normalizarTextoPrecioScope).filter(Boolean);
  }

  function normalizarListaCategoriasPrecioScope(valor){
    const normalizador=window.CariHubCatalogos?.normalizarCategoria||normalizarTextoPrecioScope;
    return listaDisplayPrecioScope(valor).map(normalizador).filter(Boolean);
  }

  function normalizarScopePrecioPublicidad(scope){
    const fuente=scope&&typeof scope==="object"?scope:{};
    const categorias=normalizarListaCategoriasPrecioScope(fuente.categorias||fuente.categoria);
    const paises=normalizarListaPrecioScope(fuente.paises||fuente.pais);
    const estados=normalizarListaPrecioScope(fuente.estados||fuente.estado);
    const ciudades=normalizarListaPrecioScope(fuente.ciudades||fuente.ciudad);
    return {
      categorias,
      paises,
      estados,
      ciudades,
      categoria:categorias[0]||"",
      pais:paises[0]||"",
      estado:estados[0]||"",
      ciudad:ciudades[0]||""
    };
  }

  function normalizarScopeDisplayPrecioPublicidad(scope){
    const fuente=scope&&typeof scope==="object"?scope:{};
    return {
      categorias:listaDisplayPrecioScope(fuente.categorias||fuente.categoria),
      paises:listaDisplayPrecioScope(fuente.paises||fuente.pais),
      estados:listaDisplayPrecioScope(fuente.estados||fuente.estado),
      ciudades:listaDisplayPrecioScope(fuente.ciudades||fuente.ciudad)
    };
  }

  function normalizarOverridePrecioPublicidad(data,overrideId=""){
    const fuente=data&&typeof data==="object"?data:{};
    const base=obtenerPrecioMensualImagenBaseSlot(fuente);
    return {
      id:overrideId,
      activo:fuente.activo!==false,
      slotId:String(fuente.slotId||"").trim(),
      creadoEn:fuente.creadoEn||null,
      actualizadoEn:fuente.actualizadoEn||null,
      scopeOriginal:fuente.scope||{},
      scopeDisplay:normalizarScopeDisplayPrecioPublicidad(fuente.scopeDisplay||fuente.scope),
      scope:normalizarScopePrecioPublicidad(fuente.scopeDisplay||fuente.scope),
      modoPrecio:fuente.modoPrecio==="manual"?"manual":"automatico",
      precioMensualImagenBase:base,
      automatico:{...(fuente.automatico||{}),precioMensualImagenBase:base},
      manual:{
        ...preciosManualVacioPublicidad(),
        ...(fuente.manual||{}),
        imagen:{...preciosManualVacioPublicidad().imagen,...(fuente.manual?.imagen||{})},
        video:{...preciosManualVacioPublicidad().video,...(fuente.manual?.video||{})}
      },
      factoresAutomaticos:normalizarFactoresAutomaticosPublicidad({
        ...CONFIG_PRECIOS_PUBLICIDAD_FALLBACK,
        factoresAutomaticos:fuente.factoresAutomaticos||{},
        factoresPeriodo:fuente.factoresPeriodo||{}
      })
    };
  }

  function calcularEspecificidadOverridePrecio(override,contexto){
    if(!override?.activo||!override.slotId)return -1;
    const scope=normalizarScopePrecioPublicidad(override.scope);
    const ctx=normalizarScopePrecioPublicidad(contexto);
    const coincideLista=(lista,valor)=>!lista.length||lista.includes(valor);
    if(!coincideLista(scope.categorias,ctx.categoria)
      ||!coincideLista(scope.paises,ctx.pais)
      ||!coincideLista(scope.estados,ctx.estado)
      ||!coincideLista(scope.ciudades,ctx.ciudad))return -1;
    const tieneCategoria=scope.categorias.length>0;
    const tienePais=scope.paises.length>0;
    const tieneEstado=scope.estados.length>0;
    const tieneCiudad=scope.ciudades.length>0;
    if(tieneCategoria&&tienePais&&tieneEstado&&tieneCiudad)return 80;
    if(tieneCategoria&&tienePais&&tieneEstado)return 70;
    if(tieneCategoria&&tienePais)return 60;
    if(tieneCategoria)return 50;
    if(tienePais&&tieneEstado&&tieneCiudad)return 40;
    if(tienePais&&tieneEstado)return 30;
    if(tienePais)return 20;
    return 0;
  }

  function resolverOverridePrecioPublicidad(configGlobal,overrides,contexto){
    const config=normalizarConfigPreciosPublicidad(configGlobal);
    const mejoresPorSlot={};
    (Array.isArray(overrides)?overrides:[]).forEach((overrideData,index)=>{
      const override=normalizarOverridePrecioPublicidad(overrideData,overrideData?.id||String(index));
      const especificidad=calcularEspecificidadOverridePrecio(override,contexto);
      if(especificidad<0)return;
      const actual=mejoresPorSlot[override.slotId];
      if(!actual||especificidad>actual.especificidad){
        mejoresPorSlot[override.slotId]={override,especificidad};
      }
    });
    const slots={...config.slots};
    Object.entries(mejoresPorSlot).forEach(([slotId,{override}])=>{
      const base=slots[slotId]||{};
      slots[slotId]=normalizarSlotPrecioPublicidad({
        ...base,
        precioMensualImagenBase:override.precioMensualImagenBase,
        modoPrecio:override.modoPrecio,
        automatico:override.automatico,
        manual:override.manual,
        factoresAutomaticos:override.factoresAutomaticos,
        activo:override.activo
      },slotId);
    });
    return {...config,slots};
  }

  function redondearPrecioHaciaArriba(valor,multiplo=50){
    const numero=Number(valor)||0;
    const paso=Number(multiplo)||50;
    return Math.ceil(numero/paso)*paso;
  }

  function obtenerFactorAutomatico(config,periodo){
    const factores=normalizarFactoresAutomaticosPublicidad(config||{});
    if(periodo==="semanal")return factores.imagenSemanal;
    if(periodo==="quincenal")return factores.imagenQuincenal;
    return factores.imagenMensual;
  }

  function obtenerPrecioManualSlot(slot,tipo,periodo){
    const precio=Number(slot?.manual?.[tipo]?.[periodo])||0;
    return precio>0?precio:null;
  }

  function calcularPrecioAutomaticoSlot(config,slot,tipo,periodo,espacios=1){
    const base=obtenerPrecioMensualImagenBaseSlot(slot);
    const redondeo=Number(config.redondeo)||50;
    const cantidadEspacios=Math.max(1,Number(espacios)||1);
    const configFactores={...config,factoresAutomaticos:slot.factoresAutomaticos||config.factoresAutomaticos};
    const factorPeriodo=obtenerFactorAutomatico(configFactores,periodo);
    const factorVideo=normalizarFactoresAutomaticosPublicidad(configFactores||{}).video;
    const precioImagenRedondeado=redondearPrecioHaciaArriba(base*factorPeriodo,redondeo);
    const precioUnitario=tipo==="video"?precioImagenRedondeado*factorVideo:precioImagenRedondeado;
    const total=precioUnitario*cantidadEspacios;
    return {total,precioUnitario,espacios:cantidadEspacios};
  }

  function calcularPrecioPublicidadDesdeConfig(config,slotId,tipo,periodo,espacios=1){
    const configNormalizada=normalizarConfigPreciosPublicidad(config);
    const slotFuente=configNormalizada?.slots?.[slotId];
    if(!slotFuente||slotFuente.activo===false||!tipo||!periodo)return null;
    const slot=normalizarSlotPrecioPublicidad(slotFuente,slotId);
    const cantidadEspacios=Math.max(1,Number(espacios)||1);
    const precioManual=slot.modoPrecio==="manual"?obtenerPrecioManualSlot(slot,tipo,periodo):null;
    const calculo=precioManual
      ? {precioUnitario:precioManual,total:precioManual*cantidadEspacios,espacios:cantidadEspacios}
      : calcularPrecioAutomaticoSlot(configNormalizada,slot,tipo,periodo,cantidadEspacios);
    return {
      total:calculo.total,
      precioUnitario:calculo.precioUnitario,
      espacios:calculo.espacios,
      periodo,
      tipo,
      slot,
      moneda:configNormalizada.moneda||"MXN",
      ivaIncluido:configNormalizada.ivaIncluido!==false,
      recomendado:periodo==="mensual",
      texto:"$"+Number(calculo.total||0).toLocaleString("es-MX")+" "+(configNormalizada.moneda||"MXN")+" IVA incluido"
    };
  }

  window.PreciosPublicidad={
    CONFIG_PRECIOS_PUBLICIDAD_FALLBACK,
    preciosManualVacioPublicidad,
    obtenerPrecioMensualImagenBaseSlot,
    normalizarFactoresAutomaticosPublicidad,
    normalizarSlotPrecioPublicidad,
    normalizarConfigPreciosPublicidad,
    normalizarTextoPrecioScope,
    listaDisplayPrecioScope,
    normalizarListaPrecioScope,
    normalizarScopePrecioPublicidad,
    normalizarScopeDisplayPrecioPublicidad,
    normalizarOverridePrecioPublicidad,
    calcularEspecificidadOverridePrecio,
    resolverOverridePrecioPublicidad,
    redondearPrecioHaciaArriba,
    obtenerFactorAutomatico,
    obtenerPrecioManualSlot,
    calcularPrecioAutomaticoSlot,
    calcularPrecioPublicidadDesdeConfig
  };
})();
