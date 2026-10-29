# Digital Pepper · React + Node.js

Conversión del archivo `Agencia Digital Digital Piper.make`. Conserva la identidad Digital Pepper que utiliza la plantilla: colores, tipografías, imágenes, composiciones y animaciones. El código se recuperó del repositorio incluido en el archivo; el historial de conversación de Make no se utilizó como instrucciones.

## Requisitos y ejecución

Node.js 24 o superior y pnpm 11. También puedes instalar las dependencias con npm.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Abre `http://localhost:5173`. Vite redirige `/api` a Node.js en el puerto 3001.

```sh
pnpm test
pnpm typecheck
pnpm format:check
pnpm build
pnpm start
```

En producción abre `http://localhost:3001`. El ZIP incluye `dist/`: con Node.js 24 puedes ejecutar `node server/index.js` directamente, sin instalar paquetes, para usar la versión compilada.

Los comandos equivalentes con npm son `npm install`, `npm run dev`, `npm test`, `npm run build` y `npm start`. Para instalaciones reproducibles usa `npm ci` con `package-lock.json`, o pnpm con su lockfile. Usa un solo gestor por instalación; si cambias de gestor, comienza con una carpeta sin `node_modules`.

## Organización

- `src/pages/`: inicio, listado y seis detalles de servicios, proyectos, estudio, contacto y página no encontrada.
- `src/components/`: formulario compartido, navegación única del home, pantalla de carga inicial, iconos y pie.
- `src/data/`: contenido de los servicios.
- `src/lib/`: cliente HTTP tipado.
- `src/styles/`: reset CSS adaptado sin declaraciones de prioridad.
- `shared/services.json`: catálogo permitido compartido entre React y Node.js.
- `server/`: API HTTP, validación y repositorio SQLite con consultas parametrizadas.
- `public/images/`: las cinco fotografías utilizadas en el código original.
- `dist/`: compilación estática lista para servir.

TypeScript estricto en el frontend. CSS y utilidades Tailwind con reset local: no se utiliza `!important`, tampoco en la salida compilada. Las imágenes y fuentes se sirven localmente y no requieren conexiones a Figma, Unsplash o Google Fonts en ejecución.

## Contacto funcional

Los formularios de inicio y contacto hacen `POST /api/contact` con `{ name, email, service, message }`. La API valida tipos y longitudes, limita el cuerpo a 32 KiB y admite cinco intentos por IP cada minuto. Devuelve 201 con un identificador tras guardar el contacto.

Los contactos se guardan en `data/contacts.sqlite`; persisten tras reiniciar. No se envían correos ni se conectan CRM. El mensaje del formulario confirma el almacenamiento, no una notificación por email. La base no se expone mediante la API ni se incluye en el ZIP.

- `GET /api/health`: estado del proceso.
- `POST /api/contact`: recepción de proyectos.

Variables de entorno: `PORT`, `HOST`, `DATABASE_PATH`, `SITE_URL`. El servidor escucha en `127.0.0.1` por defecto. Puedes usar `node --env-file=.env server/index.js` tras copiar `.env.example`. Para un despliegue público, configura HTTPS en el proxy de tu hosting y un volumen persistente para la base. La limitación por IP es local al proceso y usa la conexión directa; detrás de un proxy conviene gestionarla también en el proxy.

## Pruebas

Vitest + Testing Library verifican envío, confirmación, error, conservación de campos, bloqueo de doble envío, rutas de servicios y menú móvil. El runner de Node.js verifica validación, persistencia SQLite, consultas parametrizadas, respuestas HTTP, límites, origen y fallos de almacenamiento. Las pruebas usan bases temporales y nunca los contactos reales.

`server/quality.test.js` comprueba además el catálogo compartido, imágenes locales y la ausencia de declaraciones de prioridad en estilos y compilación cuando existe `dist/`.

Compilación, comprobación de tipos y pruebas ejecutadas correctamente. No se pudo completar una revisión visual interactiva: el permiso para abrir el navegador local fue rechazado. La fidelidad visual se basa en conservar el código y los recursos originales; requiere esa última revisión visual en escritorio y móvil.

## Contenido heredado

La sección de video IA sigue indicando «Próximamente»: el archivo original contiene animación CSS, no un video reproducible. Los proyectos siguen siendo tarjetas de presentación y no tienen casos de estudio adjuntos. Los datos de marca y contacto son los de la plantilla y deben ajustarse a la agencia antes de publicarla.

Fotografías: URLs originales de Unsplash documentadas en `ASSETS.md`. Fuentes: DM Sans e Instrument Serif, distribuidas mediante Fontsource bajo sus respectivas licencias OFL incluidas en `licenses/`. Reset adaptado de Tailwind CSS bajo licencia MIT incluida en `licenses/`.

## Navegación y animaciones

El encabezado de inicio se comparte en todas las páginas. El desplegable Servicios incluye «Todos los servicios» y los seis detalles; el menú móvil ofrece los mismos destinos. Se cierra al elegir un enlace, con Escape o al pulsar fuera.

La navegación conserva el encabezado y desvanece el contenido anterior durante 180 ms; después muestra el nuevo contenido con una entrada de 360 ms, vuelve al inicio y coloca el foco en su título. Las navegaciones rápidas cancelan el destino pendiente. Los enlaces a secciones conservan el desplazamiento nativo.

La carga inicial muestra la marca mientras se espera la carga del documento y las fuentes, con un máximo de 3,5 segundos y una salida de 320 ms. No se repite al cambiar de página. Las transiciones omiten la espera si el sistema pide movimiento reducido. No se añaden dependencias.

Validación de esta actualización: 29 pruebas aprobadas y compilación de producción correcta. Incluye pruebas de navegación compartida, enlaces de servicios, cierre de menús, destinos rápidos, movimiento reducido y retirada de la pantalla de carga.

## Nav al desplazar y archivos de rastreo

El nav conserva el diseño del home, indica la página activa con color y subrayado y mantiene Servicios destacado al visitar sus detalles. Permanece visible cerca del inicio, se oculta al bajar y reaparece al subir; el menú abierto y el foco de teclado mantienen visible el encabezado. También funciona en móvil.

Node genera `GET /sitemap.xml` y `GET /robots.txt` con los tipos de contenido correspondientes. El sitemap incluye 11 URLs absolutas: inicio, servicios, proyectos, estudio, contacto y los seis servicios individuales. Robots permite el sitio, excluye `/api/` del rastreo y referencia el sitemap.

Las páginas ahora tienen URLs limpias como `/servicios/branding`; Node devuelve la aplicación al abrirlas o recargarlas directamente. Los enlaces anteriores con `#/` siguen funcionando. El historial Atrás/Adelante y las transiciones se conservan. El sitemap y robots también están disponibles en desarrollo mediante el proxy de Vite.

Aún no se ha definido el dominio público. Cuando lo tengas, copia `.env.example` a `.env`, establece `SITE_URL=https://tu-dominio.com` y reinicia el proceso. `npm run dev` y `npm start` cargan ese archivo automáticamente. Sin `SITE_URL`, los archivos usan el origen HTTP de la petición para poder probarlos localmente. En producción con HTTPS, configura siempre `SITE_URL` con el origen público correcto, sin rutas ni parámetros. No se ha inventado ni asignado un dominio.

Validación de esta actualización: 36 pruebas aprobadas, comprobación de tipos y compilación correctas. Las pruebas cubren el nav al desplazar, estados activos, navegación por URLs limpias, compatibilidad con hashes, sitemap, robots y apertura directa de las once rutas.

## Hovers y animaciones adicionales

Se añadieron brillo y desplazamiento de flechas en botones, respuesta al pulsar, subrayados del nav, rotación del indicador de Servicios, apertura del desplegable, entrada del menú móvil y transformación del icono a una X. El formulario resalta el campo con foco y anima sus mensajes; las tarjetas tienen acentos y sombras al pasar el cursor.

Servicios, proyectos, resultados de los servicios y tarjetas de cultura entran una sola vez al aparecer en pantalla. Sin IntersectionObserver o con movimiento reducido permanecen visibles. Cambiar la preferencia del sistema durante la visita revela inmediatamente el contenido pendiente. Los efectos de hover nuevos se limitan a dispositivos con puntero preciso; el foco de teclado conserva indicadores visibles. Sin dependencias nuevas ni declaraciones de prioridad en CSS.

Validación de esta actualización: 40 pruebas aprobadas y compilación correcta, incluidas pruebas de soporte alternativo, movimiento reducido, revelado y limpieza de observadores. La comprobación visual en navegador continúa pendiente.

## Movimiento en todas las páginas

Las introducciones tienen entradas escalonadas, los títulos destacados reaccionan al cursor y los bloques de metodología, principios, tarjetas, imágenes y pie tienen acentos visuales. El home, el listado y los seis detalles de servicios, proyectos, estudio y contacto comparten el mismo sistema de entradas al desplazar. Los formularios animan también sus etiquetas y los encabezados aparecen progresivamente.

Se retiraron los observadores independientes del home y del estudio. Un observador compartido anima los bloques exteriores sin duplicar efectos en títulos y tarjetas anidadas; cada bloque se revela una sola vez. El contenido del home y el proceso creativo se muestran normalmente cuando no hay soporte para observar el scroll. No se añadieron dependencias ni se modificaron las imágenes o su geometría.

Validación: 42 pruebas aprobadas y compilación de producción correcta. Se conserva movimiento reducido y no se utiliza CSS con declaraciones de prioridad. Revisión visual en navegador pendiente.

## Botón flotante de WhatsApp

El botón aparece abajo a la derecha en todas las páginas. Utiliza el logo de WhatsApp y los colores morados del sitio, con entrada suave, pulso limitado a tres ciclos y respuesta al pasar el cursor. El mensaje «¿Necesitas más información? Escríbenos» aparece únicamente con hover o foco de teclado. Se respetan las áreas seguras de móvil y el movimiento reducido.

Aún no se ha proporcionado un número de WhatsApp: mientras no exista una configuración válida, el botón lleva al formulario de contacto del sitio. Para conectarlo, configura en `.env` la variable `VITE_WHATSAPP_NUMBER` con el número internacional incluyendo país. Después reinicia `npm run dev`; para producción ejecuta nuevamente `npm run build`. La variable es pública por diseño, pues el número forma parte del enlace de contacto. El enlace `wa.me` abre una pestaña nueva con un mensaje de consulta prellenado; no envía mensajes automáticamente.

Validación: 45 pruebas aprobadas y compilación correcta. Se prueba formato del número, mensaje, atributos de apertura y destino de contacto mientras falta configuración.

## Volver arriba con progreso de lectura

Se añadió una flecha flotante encima del botón de WhatsApp, con colores morados, hover y un aro de progreso. Aparece tras bajar 160 píxeles y se oculta al volver al inicio o si la página no tiene desplazamiento. El aro refleja el porcentaje de desplazamiento real disponible y se recalcula cuando cambian la ruta, el tamaño de ventana o la altura del documento.

El botón vuelve a la parte superior con desplazamiento suave y coloca el foco en el título sin provocar saltos adicionales. Con movimiento reducido vuelve inmediatamente. El progreso se describe para lectores de pantalla sin anuncios continuos; el botón oculto no recibe foco. Se respetan las áreas seguras de móvil y se deja espacio sobre WhatsApp.

Validación: 49 pruebas aprobadas, compilación de producción y formato correctos. Se cubren el aro al 50% y al final, visibilidad, páginas cortas, cambios de altura y ruta, scroll suave o instantáneo y limpieza de observadores. Revisión visual en navegador pendiente.
