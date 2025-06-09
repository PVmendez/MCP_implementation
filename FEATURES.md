# Características Implementadas - TodoAPI con MCP

## Resumen de Implementación

Se ha desarrollado una API de Lista de Tareas que combina endpoints REST tradicionales con un innovador protocolo MCP que permite la interacción mediante lenguaje natural.

## Nuevas Características

### 1. Sistema MCP
- Integración con OpenAI GPT-3.5 para procesamiento de lenguaje natural
- Interpretación automática de comandos en texto plano
- Conversión de lenguaje natural a acciones específicas
- Sistema de herramientas extensible

### 2. Gestión de Items
- Identificadores únicos mediante UUID v4
- Sistema de marcado de completitud
- Timestamps automáticos (creación y actualización)
- Asociación con listas específicas

### 3. API REST Completa
- Gestión de listas de tareas (CRUD)
- Manipulación de items dentro de las listas
- Endpoints especializados para marcar items como completados

## Tecnologías Implementadas

- **NestJS 9.0.0**: Framework base
- **OpenAI API**: Procesamiento de lenguaje natural
- **UUID v4**: Generación de identificadores únicos
- **Jest**: Framework de testing

## Guía de Uso

### Configuración Inicial

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variable de entorno:
```bash
# Crear archivo .env
OPENAI_API_KEY=OPENAI_API_KEY
```

> **Nota**: Para obtener la OPENAI_API_KEY, debes:
> 1. Ingeresar a: https://platform.openai.com/settings/organization/api-keys
> 2. Crear tu propio API token
> 3. Copiar el token generado y pegarlo en tu archivo .env


3. Iniciar el servidor:
```bash
npm run start:dev
```

### Ejemplos de Uso

#### 1. API REST

**Gestión de Listas:**
```bash
# Crear lista
curl -X POST http://localhost:3000/api/todolists \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Lista de Compras\"}"

# Obtener listas
curl http://localhost:3000/api/todolists

# Obtener lista específica
curl http://localhost:3000/api/todolists/1

# Actualizar lista
curl -X PUT http://localhost:3000/api/todolists/1 \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Nueva Lista de Compras\"}"

# Eliminar lista
curl -X DELETE http://localhost:3000/api/todolists/1
```

**Gestión de Items:**
```bash
# Crear item
curl -X POST http://localhost:3000/todo-lists/1/items \
  -H "Content-Type: application/json" \
  -d "{\"description\":\"Comprar leche\"}"

# Obtener items de una lista
curl http://localhost:3000/todo-lists/1/items

# Actualizar item
curl -X PUT http://localhost:3000/todo-lists/1/items/uuid-del-item \
  -H "Content-Type: application/json" \
  -d "{\"description\":\"Comprar leche deslactosada\"}"

# Marcar como completado
curl -X PUT http://localhost:3000/todo-lists/1/items/uuid-del-item/complete

# Eliminar item
curl -X DELETE http://localhost:3000/todo-lists/1/items/uuid-del-item
```

#### 2. Sistema MCP

**Listar Herramientas Disponibles:**
```bash
curl http://localhost:3000/mcp/tools
```

**Usar Procesamiento de Lenguaje Natural:**
```bash
# Crear una tarea usando lenguaje natural
curl -X POST http://localhost:3000/mcp/prompt \
  -H "Content-Type: application/json" \
  -d "{\"prompt\":\"agregar comprar pan a la lista del supermercado\"}"

# Marcar una tarea como completada
curl -X POST http://localhost:3000/mcp/prompt \
  -H "Content-Type: application/json" \
  -d "{\"prompt\":\"marcar como completada la tarea de comprar pan\"}"
```

**Usar MCP Directamente:**
```bash
curl -X POST http://localhost:3000/mcp/execute \
  -H "Content-Type: application/json" \
  -d "{
    \"tool\": \"create_todo_item\",
    \"parameters\": {
      \"list_name\": \"supermercado\",
      \"description\": \"comprar pan\"
    }
  }"
```

## Testing

Se han implementado tests unitarios y e2e que cubren:

1. **Tests Unitarios**:
   - Operaciones CRUD de listas
   - Lógica de servicios
   - Controladores

2. **Tests e2e**:
   - Flujos completos de API
   - Creación y gestión de items
   - Marcado de completitud

Para ejecutar los tests:

```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

```