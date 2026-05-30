# Snake Game - React + Vite

## Descripción
Juego Snake creado con React y Vite. Incluye menú principal, tabla de puntajes, instrucciones, dificultad ajustable, paredes aleatorias, túneles y enemigos.

## Características principales
- Pantalla principal con menú, instrucciones y tabla de puntajes.
- Selección de dificultad: fácil, normal o difícil.
- Colores de snake personalizables.
- Paredes aleatorias en cada reinicio.
- Túneles que teletransportan a la serpiente.
- Enemigo perseguidor que hace el juego más desafiante.
- Comida especial roja/azul y bonus dorado ocasional.
- Registro de mejores puntajes persistente en el navegador.

## Instalación
1. Clona este repositorio.
2. Abre una terminal en la carpeta del proyecto.
3. Ejecuta:
   ```bash
   npm install
   ```

## Ejecución
Ejecuta el servidor de desarrollo con:
```bash
npm run dev
```

Abre la dirección que indique Vite en tu navegador.

## Cómo jugar
- Usa las teclas de flecha para mover la serpiente.
- Come la comida roja o azul para ganar puntos y crecer.
- Evita chocar contra las paredes, el cuerpo de la serpiente y el enemigo.
- Si entras a un túnel, serás transportado a otro punto de salida.
- Usa `Espacio` para pausar y reanudar.
- Usa `R` para reiniciar rápidamente.

## Objetivo
Sobrevive el mayor tiempo posible, acumula puntos y sube en la tabla de puntajes.

## Notas adicionales
- El juego guarda el nombre y los puntajes en el `localStorage` del navegador.
- Las paredes se reorganizan cada vez que se reinicia el juego.
- La dificultad afecta la velocidad y el comportamiento del enemigo.
