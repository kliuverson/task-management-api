# Bitácora de desarrollo — Task Management API



Herramientas de IA utilizadas: Claude (chat) OpenAI (chatgpt) Copilot(Agente). Esta bitácora se actualiza al terminar cada bloque de trabajo.



Nota de estilo: esta es la segunda pasada. Aquí dejo los prompts tal y como los pedí yo en la práctica: directos, un poco desordenados, con contexto y sin intentar sonar como un prompt “ideal” de ingeniería. No los pulí para que se vea cómo realmente los usé: así era como avanzaba más rápido y me daba la respuesta útil.



> Las verificaciones se marcan como pendientes cuando todavía no hay un resultado real registrado. No se deben presentar como completadas hasta ejecutarlas.



---



## 1. Uso de asistentes de IA



### Uso 1 — Planificación y creación del repositorio



**Prompts utilizados (textuales):**

1. "Me pusieron esta prueba técnica para entregar en 3 días, necesito que me asesores y me ayudes." (con el PDF de la prueba adjunto)





**Qué acepté y por qué:**

- El plan de 3 días (base y configuración, autenticación, CRUD de tareas, cierre y documentación). Lo acepté porque se ajusta a los criterios de evaluación del PDF y me da un orden claro.

- Las tecnologías sugeridas: PostgreSQL con la librería `pg`, AJV para validación y Swagger para la documentación. Elegí PostgreSQL porque era una tecnología nueva para mí y quería aprenderla. También me habían recomendado utilizarla para la prueba.



**Qué modifiqué:**

- La IA entregó el código completo del Día 1 de una sola vez. Le pedí ir paso a paso, empezando por crear y clonar el repositorio, para entender y probar cada bloque antes de seguir.



**Verificación realizada:**

- Repositorio público en GitHub, clonado en local, con commits publicados y el evaluador invitado como colaborador.



### Uso 2 — Día 1: estructura, configuración, errores, base de datos y Express



**Prompts utilizados (textuales, como los escribí realmente):**

1. "vamos con el día uno, dame un plan para iniciar con el proyecto, estructura de archivos y una forma mas facil adaptada al documento para comenzar"

2. "tengo 3 días, quiero un plan día por día para cubrir todo el PDF. Por cada día: bloques en orden, qué reviso al terminar y qué decisiones tengo que tomar yo con pros y contras, sin decidir por mí. sin código todavía"



Nota final: estos fueron los prompts reales del bloque de trabajo. No están redactados como si fueran una especificación de producto ni una conversación pulida con el modelo; son mensajes cortos, prácticos y muy orientados a avanzar con pruebas reales y validaciones concretas.



3. "ok, inicializamos el proyecto dentro del repo clonado. necesito package.json, dependencias (express, pg, dotenv y dev para TypeScript con tsx), tsconfig en modo estricto, scripts dev/build/start, .gitignore y .env.example. Windows + PowerShell. Quiero los comandos y cada archivo en su carpeta. también dime cómo comprobar que npm run dev reconoce el script y que .env no se sube a Git."



4. "Config Singleton. quiero un módulo src/config/env.ts con patrón Singleton que cargue .env solo una vez y falle al arrancar si falta una variable obligatoria (JWT_SECRET y datos de la BD). TypeScript estricto, JSDoc, sin librerías extra. Quiero el archivo completo y una explicación en 3 líneas para poder explicarlo yo. Y un server.ts temporal que imprima el puerto y el nombre de la BD para verificar."

5. "Necesito errores personalizados y manejador central. Quiero clases AppError base, ValidationError, AuthenticationError, NotFoundError, ConflictError; y un middleware que responda siempre el mismo JSON { error: { code, message, details } }. Si algo explota, que responda 500 genérico sin detalles internos. Entrega los archivos y explica por qué se usa Object.setPrototypeOf. Qué prueba hago para provocar 404 y ver el JSON."

6. "ahora la conexión a la base y el esquema. Quiero PostgreSQL con Pool y el SQL de dos tablas: users y tasks. Antes de escribir el SQL, dime qué decisiones hay: tipo de ID, restricciones, cascada, índices, con pros y contras. Luego me enseñas cómo ejecutar el esquema con psql y listar las tablas."

7. "quiero app Express con GET /health. Separado en app.ts y server.ts. app.ts arma la app y server.ts comprueba la BD y escucha. Usa el middleware de errores y un handler para rutas inexistentes. Prueba con curl.exe y dime qué respuesta espero en /health y en una ruta que no exista."

8. "hazme el repositorio de usuarios. Capa de persistencia con crear usuario y buscar por email. Consultas parametrizadas, tipos de TS, nada de lógica de contraseñas ni HTTP aquí. Quiero el código y explicación de por qué los parámetros evitan SQL injection."

9. "ahora servicio de autenticación con register y login. Hash con bcrypt, si hay problema en Windows proponme una alternativa. Email normalizado. Mismo mensaje para email inexistente y contraseña incorrecta. JWT con solo el id del usuario. Que nunca devuelva el hash. Usa mis errores personalizados. Entrega el código y explica los puntos de seguridad que podría defender en video."

10. "Necesito validación con AJV para registro y login. Mi política: contraseña de 12 a 64 caracteres, sin reglas de composición. Explícame de dónde sale el máximo. Quiero un middleware reutilizable que compile el esquema una sola vez y devuelva ValidationError con detalle por campo."

11. "Endpoints de auth: POST /auth/register y POST /auth/login. Códigos esperados: 201, 400 y 409 en registro; 200, 400 y 401 en login. Quiero archivos y una batería de pruebas con curl.exe para PowerShell cubriendo cada caso, incluyendo comprobar que el hash guardado en la BD empieza con $2."

12. "hazme el middleware JWT. Que lea Authorization: Bearer ..., verifique firma y expiración y ponga el id del usuario en req.userId con la extensión de tipos. Debe distinguir token expirado de inválido; ambos dan 401."

13. "repo de tareas. Quiero persistencia con crear, listar, buscar por id y eliminar, pero con seguridad: todas las consultas deben filtrar por user_id para que un usuario nunca toque tareas ajenas. Muéstrame el código y explica por qué esto resuelve la autorización en la BD."

14. "quiero actualización parcial. Mi decisión: PUT solo cambia los campos enviados. Tiene que construir el SET dinámico sin permitir SQL injection. Casos: campo ausente no se toca, null borra descripcion o fecha_vencimiento, y si no manda campos devuelve la tarea sin cambios. Quiero ver 4 pruebas: sin token, inválido, válido y expirado; y cómo simular expiración cambiando JWT_EXPIRES_IN."

15. "esquemas AJV para tareas: crear y actualizar, y validar :id como UUID. Reglas: solo titulo obligatorio, estado con 3 valores, additionalProperties false, y update exige al menos un campo. Amplía el middleware de validación para validar también req.params."

16. "servicio y controlador de tareas. Si la tarea no existe o es de otro usuario, debe responder 404 y no 403. Antes de decidir, dime pros y contras de 404 frente a 403; yo te digo cuál usó."

17. "rutas protegidas y pruebas. /tasks protegidas con JWT y validaciones. Quiero una batería de 12 pruebas para PowerShell con una función auxiliar y dos usuarios, y que el usuario B reciba 404 al leer, editar y borrar la tarea del usuario A."

18. "ya quiero Swagger. Documenta todos los endpoints con swagger-jsdoc y swagger-ui-express en /docs, con esquemas reutilizables, seguridad y códigos de respuesta de cada endpoint."

19. "quiero README.md con descripción, arquitectura (árbol de carpetas), requisitos, instalación local paso a paso, .env con tabla de variables, comandos, endpoints y formato de errores. Windows."

Entorno: Windows.



### Errores que tuve y prompts que usé

1. E1. psql no se reconoce Instalé PostgreSQL 18 en Windows (ruta C:\Program Files\PostgreSQL\18). En PowerShell, dentro de VS Code, psql --version da: "El término 'psql' no se reconoce como nombre de un cmdlet...". ¿Qué debo revisar? Dame el diagnóstico y la solución paso a paso, y cómo comprobar que quedó.

2. Falla la contraseña de PostgreSQL sql -U postgres -c "CREATE DATABASE taskdb;" y pgAdmin dan "la autentificación password falló para el usuario postgres". No recuerdo la contraseña de instalación. Windows, PostgreSQL 18, instalación local solo para desarrollo. ¿Cómo la restablezco sin reinstalar? Dime los riesgos de seguridad de cada paso y cómo dejar todo seguro al final.

3. Estoy en C:\Users\yeison\task-management-api y npm run dev da "Missing script: dev". Ya agregué el bloque "scripts" en package.json, pero npm run solo lista "test". ¿Qué compruebo? Adjunto el resultado de Get-Content package.json.

4. Al ejecutar npm run dev: "TypeError: Cannot read properties of undefined (reading 'port')" en server.ts:3. server.ts hace import { config } from './config/env'. ¿Qué significa y qué reviso? Salida de Get-Content src\config\env.ts: (vacía).

5. git add src/api/middlewares/validate.ts y git commit dicen "nothing to commit, working tree clean", pero acabo de pegar el código nuevo. ¿Cómo compruebo si el archivo se guardó y qué otras causas hay?

6. Agregué Swagger y al abrir http://localhost:3000/docs responde el 404 en JSON de mi manejador ("Ruta GET /docs no encontrada"). La API corre con npm run dev. ¿Qué archivos reviso (app.ts y swagger.ts) y cómo confirmo que se guardaron y que la API tomó los cambios?

7. /docs carga, pero muestra "No operations defined in spec!" y solo aparecen los Schemas. Uso swagger-jsdoc con apis: [path.join(__dirname, '../api/routes/*.{ts,js}')] en Windows con tsx. Los comentarios @openapi existen en auth.routes.ts. ¿Cuál es la causa probable y cómo la verifico?

8. Al abrir http://localhost:3000/ me responde un 404 en JSON ("Ruta GET / no encontrada"). ¿Es un error o el comportamiento esperado de mi API? ¿Qué URL debería abrir?



### Prompts que usé para aprender y revisar con criterio

1. Explícame este archivo línea por línea como si tuviera que defenderlo en una entrevista. Termina con 3 preguntas que me haría un evaluador y sus respuestas:[[text](src/config/swagger.ts)]

2. Revisa este código [(src/services/auth.service.ts)] buscando fallos de seguridad, de concurrencia y de manejo de errores. Para cada hallazgo: dónde está, cómo lo reproduzco y cómo lo corregiría:


**Qué acepté y por qué:**

- **Arquitectura por capas** (`api`, `controllers`, `services`, `persistence`, `config`, `errors`): separa responsabilidades y es lo que pide la prueba.

- **Configuración Singleton** (`src/config/env.ts`): carga las variables de entorno una sola vez y falla al arrancar si falta una obligatoria. Es preferible detectar una configuración incompleta al arrancar, en lugar de dejar que la aplicación falle más tarde durante una petición.

- **Errores personalizados y manejador central**: respuestas JSON con el mismo formato y sin exponer detalles internos en los errores 500.

- **Esquema SQL propuesto por la IA:** `UUID` como id, `CHECK` en `estado`, `ON DELETE CASCADE` en `user_id` e índice en `tasks(user_id)`. No fueron decisiones que propuse inicialmente; las acepté después de revisar su propósito:
  - **UUID:** identifica registros con valores únicos sin depender de una secuencia numérica.
  - **CHECK en `estado`:** restringe los valores permitidos directamente en la base de datos.
  - **ON DELETE CASCADE:** elimina las tareas asociadas cuando se elimina su usuario. Es práctico, aunque implica que borrar un usuario también borra sus tareas.
  - **Índice en `tasks(user_id)`:** ayuda a consultar las tareas de un usuario con mayor eficiencia.

- **Separación de `app.ts` y `server.ts`:** `app.ts` arma la aplicación y `server.ts` solo la arranca.



**Qué modifiqué o corregí:**

- Varios comandos venían en formato bash (por ejemplo `grep`) y no funcionan en PowerShell; usé equivalentes de PowerShell (`Select-String`, `Get-Content`).



**Verificación realizada:**

- `npm run dev`: la bitácora registra que la API escuchó en `http://localhost:3000`.

- `GET /health`: HTTP/1.1 200 OK {"status":"ok"}
- Ruta inexistente: HTTP/1.1 404 Not Found {"error":{"code":"NOT_FOUND","message":"Ruta GET /nada no encontrada"}}
- Tablas `users` y `tasks` en `taskdb`:  Listado de tablas                                                               
 Esquema | Nombre | Tipo  |  Due±o   
---------+--------+-------+----------
 public  | tasks  | tabla | postgres
 public  | users  | tabla | postgres



### Uso 3 — Día 2: autenticación (registro, login y middleware JWT)



**Prompts utilizados:** no escribí un prompt específico para esta parte; seguí el plan del Día 2 propuesto por la IA, bloque por bloque, probando cada uno antes de pasar al siguiente.



**Qué acepté y por qué:**

- **Hash con bcrypt**, nunca texto plano: si la base de datos se filtra, las contraseñas no se pueden leer directamente.

- **Email normalizado** (minúsculas y sin espacios) para que `Ana@mail.com` y `ana@mail.com` no sean cuentas distintas.

- **Mismo mensaje de error** para email inexistente y contraseña incorrecta, para no revelar qué emails están registrados.

- **El token guarda solo el id del usuario** (`sub`), sin datos sensibles.

- **El servicio nunca devuelve `password_hash`** al cliente.

- **Consultas parametrizadas** (`$1, $2, $3`) en el repositorio para evitar inyección SQL.

- **`bcryptjs` en lugar de `bcrypt`**, sugerido por la IA para evitar la compilación nativa en Windows. Es el mismo algoritmo.

- **Máximo de 64 caracteres en la contraseña**, sugerido por la IA por el límite de 72 bytes de bcrypt. Acepté el máximo de 64 caracteres como límite de validación. Debo tener presente que bcrypt limita la entrada por bytes (72), no por caracteres; si se admiten caracteres multibyte, debo comprobar que la implementación no trunque contraseñas distintas al calcular el hash.



**Qué modifiqué, rechacé o detecté:**

- La IA llamó "decisiones tuyas" a algunas decisiones que en realidad eran suyas (UUID, `CHECK`). Lo corregí y las registré en la sección de lo aceptado.

- Revisé dos riesgos. (1) Registro simultáneo con el mismo email: decidí capturar el error `23505` cuando corresponde a la restricción única del email y convertirlo en `ConflictError`/HTTP 409. (2) Diferencia temporal en el login: decidí usar una comparación con un hash ficticio precalculado cuando el email no existe, para reducir la diferencia de tiempo. Esta mitigación no elimina toda posibilidad de enumeración, ya que el registro sigue respondiendo 409 cuando el email ya existe.



**Verificación de autenticación** (resultados reales de mis pruebas con `curl` y `node`):

| Prueba | Resultado esperado | Resultado obtenido |
|---|---|---|
| Registro válido | 201, sin `password_hash` | 201; la respuesta trae id, nombre, email y fecha, sin `password_hash` |
| Registro duplicado | 409 | 409, `CONFLICT`, "El email ya está registrado" |
| Contraseña de menos de 12 caracteres | 400 con detalle del campo | 400, `VALIDATION_ERROR`, campo `password` ("must NOT have fewer than 12 characters") |
| Contraseña de más de 64 caracteres | 400 | 400, `VALIDATION_ERROR`, campo `password` ("must NOT have more than 64 characters"), con una contraseña de 70 caracteres |
| Login correcto | 200 con token | 200, con `token` y datos del usuario |
| Login con contraseña incorrecta | 401 | 401 |
| Login con email inexistente | 401 | 401 |
| Hash en la base de datos | Empieza con `$2` | `$2b$10$...`; no hay contraseña en texto plano |
| Duración del token | 1 hora | `exp` menos `iat` = 3600 s |
| Ruta protegida (`GET /tasks`) sin token | 401 | 401, "Token no proporcionado" |
| Ruta protegida con token inválido (`abc.def.ghi`) | 401 | 401, "Token inválido" |
| Ruta protegida con token con la firma alterada | 401 | 401, "Token inválido" |
| Ruta protegida con token válido | 200 | 200 |
| Ruta protegida con token expirado (`JWT_EXPIRES_IN=5s`, espera de 7 s) | 401, "Token expirado" | 401, "Token expirado" |


---



## 2. Decisiones tomadas sin asistencia de IA



Para estas decisiones la IA solo resumió pros y contras de cada opción; la elección y la justificación son mías.



### Decisión 1 — Política de contraseñas



**Alternativas consideradas:** (a) mínimo de 8 caracteres sin más reglas; (b) mínimo de 8 con mayúscula, número y símbolo; (c) mínimo más largo sin reglas de composición.



**Decisión:** longitud mínima de 12 caracteres, sin exigir combinación de mayúsculas, minúsculas, números y símbolos.



**Justificación:** quiero equilibrar seguridad y comodidad. Permitir contraseñas largas o frases fáciles de recordar mejora la experiencia de registro sin imponer reglas de composición que, por sí solas, no garantizan que una contraseña sea difícil de adivinar.



**Complementos:** las contraseñas se guardan con bcrypt; se valida que no estén vacías y que no superen un máximo, para evitar problemas de procesamiento.



### Decisión 2 — Duración del token JWT



**Alternativas consideradas:** token corto (15 minutos a 1 hora) o largo (varios días).



**Decisión:** una hora, sin renovación automática en esta primera versión.



**Justificación:** una hora permite una sesión de trabajo habitual sin pedir login constantemente, pero limita el tiempo de uso de un token expuesto. Entiendo que la expiración no revoca un token antes de tiempo; por eso la API verifica la firma y la fecha de expiración en cada ruta protegida. El usuario debe iniciar sesión de nuevo cuando expira.



### Decisión 3 — Actualización parcial



**porque lo elijo**&#x41;unque el estándar HTTP define PUT como un reemplazo total, en el desarrollo web moderno de APIs REST, los clientes (frontends en React, móviles, etc.) casi siempre necesitan actualizar propiedades individuales sin tener que cargar y reenviar el objeto entero. Optar por la actualización parcial hace que la API sea mucho más amigable y práctica de consumir.



### Criterio general



Equilibrar seguridad y comodidad sin añadir complejidad innecesaria para el alcance de esta prueba. Estas decisiones son de esta versión y pueden revisarse si cambian los requisitos o el nivel de riesgo.



---

### Decisión 4 — Registro simultáneo con el mismo email



**Hallazgo:** al revisar `register`, la IA señaló que la comprobación previa del email y la inserción no son una operación atómica. Lo reproduje lanzando 5 registros idénticos a la vez: salieron `201 500 500 409 409` y `201 500 500 500 409`. En los logs del servidor apareció el error `23505` de la restricción `users_email_key`, que la API devolvía como 500 en vez de 409.



**Alternativas consideradas:** capturar el error `23505` de PostgreSQL, o usar `INSERT ... ON CONFLICT DO NOTHING`. También consideré dejar el problema documentado sin corregir, pero lo descarté porque la API respondería 500 ante un conflicto esperado.



**Decisión:** mantener el `INSERT` actual y capturar el error `23505` cuando corresponde a la restricción de unicidad del email, lanzando un `ConflictError` para que la API responda 409.



**Justificación:** conserva la consulta y la estructura actual del repositorio. Descarté `ON CONFLICT DO NOTHING` no porque sea una mala práctica, sino porque obligaba a adaptar el repositorio sin ofrecer una ventaja decisiva para el alcance de esta prueba. Mantengo la restricción `UNIQUE` en la base de datos porque la comprobación previa no evita por sí sola los duplicados cuando hay solicitudes simultáneas.



**Verificación:** Tras el cambio repetí la prueba con cinco registros simultáneos. En las dos tandas obtuve `409 201 409 409 409`: se creó un solo usuario, las demás solicitudes recibieron 409 y no aparecieron errores inesperados en los logs.



### Decisión 5 — Costo de bcrypt (`SALT_ROUNDS`)



**Alternativas consideradas:** mantener 10, subir a 11 o subir a 12.



**Mediciones en mi equipo** (`bcryptjs`, `hashSync`, 3 tandas): costo 10: 182–187 ms; costo 11: 318–429 ms; costo 12: 695–700 ms (en la primera tanda el costo 12 no quedó registrado). Un login completo con costo 10 tardó entre 150 y 240 ms.



**Decisión:** mantener `SALT_ROUNDS = 10`.



**Justificación:** busco un equilibrio entre la protección de las contraseñas y el rendimiento de la API. Un costo mayor encarece cada intento de un atacante si se filtran los hashes, pero también aumenta el tiempo de registro e inicio de sesión. Con costo 12, cada hash tardaría cerca de 700 ms, unas 3,7 veces más que con 10. Descarté subir el costo porque `bcryptjs` realiza el cálculo en JavaScript y un costo mayor aumenta el trabajo de CPU por petición; bajo concurrencia, esto puede afectar la capacidad de respuesta; además, cada intento con un email inexistente paga el mismo costo por el hash falso. La decisión se basa en estas mediciones y no en elegir el número más alto. Esta decisión prioriza un rendimiento razonable para el alcance de la prueba, sin afirmar que el costo 10 sea el más seguro en todos los contextos.



**Consideración futura (señalada por la IA):** cambiar el costo no actualiza los hashes de los usuarios existentes. Si se modificara, habría que volver a calcular el hash tras un login correcto y mantener coherente el costo del hash falso usado para igualar los tiempos de respuesta.

## 3. Retos y soluciones



**`psql` no se reconocía en PowerShell.** PostgreSQL 18 estaba instalado, pero su carpeta `bin` no estaba en el PATH. Agregué `C:\Program Files\PostgreSQL\18\bin` a las variables de entorno y reinicié VS Code. Comprobé con `psql --version`.



**Falló la autenticación de PostgreSQL.** No recordaba la contraseña de instalación, ni `psql` ni pgAdmin me dejaban entrar. Cambié temporalmente a `trust` las dos líneas `host` de `pg_hba.conf`, reinicié el servicio, definí una contraseña nueva y devolví las líneas a `scram-sha-256` con otro reinicio. Verifiqué que `psql -U postgres -l` volvía a pedir contraseña y listaba `taskdb`.



**Archivos que parecían guardados pero no lo estaban.** `npm run dev` decía que el script no existía porque `package.json` seguía con el contenido original, y `src/config/env.ts` estaba vacío, por lo que `config` llegaba `undefined`. Aprendí a verificar el contenido real en disco con `Get-Content` y `npm run` antes de ejecutar.



**Comandos de bash en PowerShell.** Algunos comandos propuestos (`grep`, `mkdir -p`) no funcionaron en PowerShell; usé los equivalentes.



No agrego otros retos en esta sección hasta documentar problemas concretos y sus soluciones; los hallazgos específicos de autenticación y JSON inválido se describen a continuación.



### Hallazgo — JSON mal formado devolvía 500



**Hallazgo:** la IA sugirió probar el manejo de un cuerpo con JSON inválido. Ejecuté `curl.exe -i -X POST .../auth/login -d "{mal"` y la API respondió `500 INTERNAL_ERROR`, cuando es un error del cliente y debería ser 400. La causa es que `express.json()` lanza un error de otro tipo (`entity.parse.failed`) y el manejador central solo reconocía los `AppError`.



**Decisión:** detectar ese tipo de error en el manejador central y responder 400 con el código `VALIDATION_ERROR` y un mensaje fijo, sin exponer el mensaje interno del parser.



**Verificación:** tras el cambio, la misma petición responde 400 con el mensaje nuevo, y un login válido sigue respondiendo 200.



### Estado final y limitaciones conocidas

Implementado: registro, login con JWT, middleware de autenticación, CRUD de tareas con autorización por dueño, validación con AJV, manejo central de errores, Swagger en /docs, JSDoc y README.



Limitaciones conocidas: el registro revela si un email existe (409); no hay rate limiting ni renovación de tokens; bcryptjs calcula en el hilo principal.


**No implementado:** pruebas automatizadas con Vitest y despliegue en un servicio online (ambos opcionales en la prueba).


