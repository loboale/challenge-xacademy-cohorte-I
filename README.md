# 🏨 Shady Meadows - QA Automation Challenge

Proyecto de automatización de pruebas para el challenge final de **QA Automation - XAcademy 2026 (Cohorte I)**.

**Autor:** Alexis Aragón Rodriguez  
**Repositorio:** [GitHub](https://github.com/loboale/challenge-xacademy-cohorte-I)

## 📋 Descripción del Proyecto

Automatización de pruebas funcionales, de validación y de API para el sistema de reservas de hotel **Shady Meadows** (`https://automationintesting.online/`). El proyecto cubre tres módulos principales (Reservas, Contacto y Administración) utilizando **Cypress** con **Page Object Model**, **custom commands** y **fixtures**.

El objetivo es demostrar habilidades de testing automation real, incluyendo detección y documentación de bugs, validación de respuestas de API, y organización profesional de casos de prueba.

## 🗂️ Estructura del Proyecto

```text
challenge-xacademy-cohorte-I/
├── cypress/
│   ├── e2e/                    # Especificaciones de prueba (specs)
│   │   ├── reservas.cy.js      # Módulo de Reservas
│   │   ├── contacto.cy.js      # Módulo de Contacto
│   │   └── admin.cy.js         # Módulo de Administración
│   ├── fixtures/               # Datos de prueba en JSON
│   ├── pages/                  # Page Object Models
│   ├── commands/               # Custom Commands de Cypress
│   └── support/                # Configuración y manejo de errores
├── .gitignore
├── README.md
└── package.json
```

## 🧪 Módulos y Tests Automatizados

### 📅 Módulo de Reservas (`reservas.cy.js`)
| ID | Descripción | Tipo |
|----|-------------|------|
| TC-Res-01 | Reserva exitosa con datos válidos | Happy Path |
| TC-Res-02 | Formulario vacío muestra errores de validación | Validación |
| TC-Res-03 | Límites de caracteres (Nombre min 3, Apellido max 30) | Borde |
| TC-Res-04 | Teléfono con 10 dígitos (error 400) | Validación |
| TC-Res-05 | Fechas en el pasado (bug - API responde 201) | Bug Documentado |
| TC-Res-06 | Correo con formato incompleto (bug - API responde 201) | Bug Documentado |
| TC-Res-07 | Fechas invertidas provocan error 409 y pantalla negra | Bug Documentado |
| TC-Res-08 | Teléfono con caracteres alfabéticos (bug - API responde 201) | Bug Documentado |
| TC-Res-09 | Reserva duplicada (bug - API responde 409) | Bug Documentado |

### 📧 Módulo de Contacto (`contacto.cy.js`)
| ID | Descripción | Tipo |
|----|-------------|------|
| TC-Cont-01 | Envío exitoso del formulario de contacto | Happy Path |
| TC-Cont-02 | Formulario vacío muestra errores de validación | Validación |
| TC-Cont-03 | Teléfono con caracteres alfabéticos (bug - API responde 200) | Bug Documentado |
| TC-Cont-04 | Name con caracteres numéricos (bug - API responde 200) | Bug Documentado |
| TC-Cont-05 | Email con formato inválido (bug - API responde 200) | Bug Documentado |
| TC-Cont-06 | Message supera los 2000 caracteres (API rechaza con 400) | Borde |

### 🔐 Módulo de Administración (`admin.cy.js`)
| ID | Descripción | Tipo |
|----|-------------|------|
| TC-Adm-01 | Login exitoso como administrador | Happy Path |
| TC-Adm-02 | Login fallido con credenciales inválidas | Validación |
| TC-Adm-03 | Login con campos vacíos - muestra "Invalid credentials" | Validación |
| TC-Adm-04 | Acceso no autorizado - redirige al login | Validación |
| TC-Adm-05 | Creación de habitación duplicada (bug - API responde 201) | Bug Documentado |
| TC-Adm-06 | Responder mensaje - falta botón "Reply" | Bug Documentado |
| TC-Adm-07 | Creación de nueva habitación con datos válidos | Happy Path |
| TC-Adm-08 | Falta el precio - muestra "Failed to create room" | Validación |
| TC-Adm-09 | Sección Report es visible | Smoke Test |
| TC-Adm-10 | Branding - error "Url should be a correct url format" | Bug Documentado |

## 🐛 Bugs Documentados

Todos los bugs encontrados durante las pruebas exploratorias y automatizadas están documentados en **Trello**, siguiendo un formato profesional con evidencia, pasos para reproducir y severidad.

🔗 **Tablero de Trello:** [Challenge Final - QA Automation - Xacademy](https://trello.com/b/mOcLzyuJ)

**Bugs críticos encontrados:**
- `BUG-SHADY-001`: Fechas invertidas provocan error 409 y pantalla negra.
- `BUG-SHADY-002`: Reserva duplicada provoca error 409 y pantalla negra.
- `BUG-SHADY-004`: El sistema permite reservar con fechas en el pasado.

## 🚀 Cómo Ejecutar

1. Clonar el repositorio:
   \`\`\`bash
   git clone https://github.com/loboale/challenge-xacademy-cohorte-I.git
   \`\`\`
2. Instalar dependencias:
   \`\`\`bash
   npm install
   \`\`\`
3. Ejecutar Cypress:
   \`\`\`bash
   npx cypress open
   \`\`\`

   
