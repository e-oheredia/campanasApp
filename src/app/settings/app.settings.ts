export class AppSettings {
    
    /* URL */ 
    
    public static API_ENDPOINT = "http://localhost:8072/";
    public static BUZON_URL = "buzones/";
    public static EMPLEADO_URL = "empleados/";
    public static PLAZO_URL = "plazos/";
    public static TIPO_SERVICIO_URL = "tiposservicio/";
    public static TIPO_SEGURIDAD_URL = "tiposseguridad/";
    public static TIPO_DOCUMENTO_URL = "tiposdocumento/";
    public static TIPO_DESTINO_URL = "tiposdestino/";
    public static TIPO_AGRUPADO_URL = "tiposagrupado/";
    public static PAIS_URL = "paises/";
    public static DEPARTAMENTO_URL = "departamentos/";
    public static PROVINCIA_URL = "provincias/";
    public static DISTRITO_URL = "distritos/";
    public static DOCUMENTO_URL = "documentos/";
    public static AREA_URL = "areas/";
    public static ENVIO_URL = "envios/";
    public static ENVIO_MASIVO_URL = "enviosmasivos/";
    public static PROVEEDOR_URL = "proveedores/";
    public static GUIA_URL = "guias/";
    public static DOCUMENTO_GUIA_URL = "documentosguia/";
    public static ESTADO_DOCUMENTO_URL = "estadosdocumento/";
    public static TIPO_ESTADO_DOCUMENTO_URL = "tiposestadodocumento/";
    public static MENU_URL = "menus/";
    public static CAMPANA_URL = "campanas/";
    public static TIPO_CAMPANA_URL = "tiposcampana/";
    public static PAQUETE_HABILITADO_URL = "paquetes/";
    public static ACCION_RESTOS_PROVEEDOR_URL = "accionesrestosproveedor/";
    public static URL_AUTORIZACIONES = "http://localhost/campana-static/autorizaciones/"
    public static URL_MUESTRAS = "http://localhost/campana-static/muestras/"
    public static RUTA_PLANTILLA = "http://www.google.com"

    public static PREFIJO = {
        DOCUMENTO : "DOC",
        PAQUETE : "PAQ"
    }


    /** IMAGENES */

    public static logoImagePath = '/assets/images/logo-externus.png'

    /** TABLES */

    public static tableSettings = {
        editable: false, 
        columns: {},
        actions: {
            add: false,
            edit: false,
            delete: false,
          }, 
        hideSubHeader: true,
        attr: {
            class: 'table table-bordered'
          }
    }

}