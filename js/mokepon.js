//const { application, JSON } = require("express");

const sectionReiniciar = document.getElementById("boton-reiniciar");
const botonMascotaJugador = document.getElementById("boton-mascota");
const botonReiniciar = document.getElementById("boton-reiniciar");
const sectionSeleccionarMascota = document.getElementById(
  "seleccionar-mascota"
);
const sectionSeleccionarAtaque = document.getElementById("Seleccionar-ataque");
const spamMascotaJugador = document.getElementById("mascota-jugador");
const spamMascotaEnemigo = document.getElementById("mascota-enemigo");
const spanVidasJugador = document.getElementById("vidas-jugador");
const spanVidasEnemigo = document.getElementById("vidas-enemigo");
const ataqueDeJugador = document.getElementById("ataque-jugador");
const ataqueDeEnemigo = document.getElementById("ataque-enemigo");
const sectionMensajes = document.getElementById("resultado");
const contenedorTarjetas = document.getElementById("contenedor-tarjetas");
const contenedorAtaques = document.getElementById("contenedor-ataques");
const sectionVerMapa = document.getElementById("ver-mapa");
const mapa = document.getElementById("mapa");

let jugadorId = null;
let mokepones = [];
let mokeponesEnemigos = [];
let ataqueJugador = [];
let ataqueEnemigo = [];
let opcionDeMokepones;
let inputHipodogue;
let inputCapipepo;
let inputRatigueya;
let mascotaJugador;
let mascotaJugadorObjeto;
let ataquesMokepon;
let ataquesMokeponEnemigo;
let botonFuego;
let botonAgua;
let botonTierra;
let botones = [];
let indexAtaqueJugador;
let indexAtaqueEnemigo;
let victoriasJugador = 0;
let victoriasEnemigo = 0;
let vidasJugador = 3;
let vidasEnemigo = 3;
let lienzo = mapa.getContext("2d");
let intervalo;
let mapaBackground = new Image();
mapaBackground.src = "./assets/mokemap.webp";
let alturaQueBuscamos;
let anchoDelMapa = window.innerWidth - 20;
const anchoMaximoMapa = 350;

if (anchoDelMapa > anchoMaximoMapa) {
  anchoDelMapa = anchoMaximoMapa - 20;
}

alturaQueBuscamos = (anchoDelMapa * 600) / 800;

mapa.width = anchoDelMapa;
mapa.Hipodogue = alturaQueBuscamos;

class Mokepon {
  constructor(nombre, foto, vida, fotoMapa, id = null) {
    this.id = id;
    this.nombre = nombre;
    this.foto = foto;
    this.vida = vida;
    this.ataques = [];
    this.alto = 40;
    this.ancho = 40;
    this.x = aleatorio(0, mapa.width - this.ancho);
    this.y = aleatorio(0, mapa.height - this.alto);
    this.mapaFoto = new Image();
    this.mapaFoto.src = fotoMapa;
    this.velocidadx = 0;
    this.velocidady = 0;
  }

  pintarMokepon() {
    lienzo.drawImage(this.mapaFoto, this.x, this.y, this.ancho, this.alto);
  }
}

let Hipodogue = new Mokepon(
  "Hipodogue",
  "./assets/mokepons_mokepon_hipodoge_attack.png",
  5,
  "./assets/hipodoge.png"
);

let Capipepo = new Mokepon(
  "Capipepo",
  "./assets/mokepons_mokepon_capipepo_attack.png",
  5,
  "./assets/capipepo.webp"
);
let Ratigueya = new Mokepon(
  "Ratigueya",
  "./assets/mokepons_mokepon_ratigueya_attack.png",
  5,
  "./assets/ratigueya.png"
);

const HIPODOGE_ATAQUES = [
  { nombre: "💧", id: "boton-agua" },
  { nombre: "💧", id: "boton-agua" },
  { nombre: "💧", id: "boton-agua" },
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "🌱", id: "boton-tierra" },
];
Hipodogue.ataques.push(...HIPODOGE_ATAQUES);

const CAPIPEPO_ATAQUES = [
  { nombre: "🌱", id: "boton-tierra" },
  { nombre: "🌱", id: "boton-tierra" },
  { nombre: "🌱", id: "boton-tierra" },
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "💧", id: "boton-agua" },
];

Capipepo.ataques.push(...CAPIPEPO_ATAQUES);

const RATIGUEYA_ATAQUES = [
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "🔥", id: "boton-fuego" },
  { nombre: "🌱", id: "boton-tierra" },
  { nombre: "💧", id: "boton-agua" },
];

Ratigueya.ataques.push(...RATIGUEYA_ATAQUES);

mokepones.push(Hipodogue, Capipepo, Ratigueya);

function iniciarJuego() {
  sectionSeleccionarAtaque.style.display = "none";
  sectionVerMapa.style.display = "none";

  mokepones.forEach((mokepon) => {
    opcionDeMokepones = ` <input type="radio" name="mascota" id=${mokepon.nombre} />
        <label class='tarjeta-de-mokepon' for=${mokepon.nombre} 
        <p>${mokepon.nombre}</p>
        <img src=${mokepon.foto} alt=${mokepon.nombre} />
    </label>`;

    contenedorTarjetas.innerHTML += opcionDeMokepones;
    inputHipodogue = document.getElementById("Hipodogue");
    inputCapipepo = document.getElementById("Capipepo");
    inputRatigueya = document.getElementById("Ratigueya");
  });
  sectionReiniciar.style.display = "none";
  botonMascotaJugador.addEventListener("click", seleccionarMascotaJugador);
  botonReiniciar.addEventListener("click", reiniciarJuego);

  unirseAlJuego();
}

function unirseAlJuego() {
  fetch("http://localhost:8080/unirse").then(function (res) {
    if (res.ok) {
      res.text().then(function (respuesta) {
        // console.log(respuesta)
        jugadorId = respuesta;
      });
    }
  });
}

function seleccionarMascotaJugador() {
  sectionSeleccionarMascota.style.display = "none";

  if (inputHipodogue.checked) {
    spamMascotaJugador.innerHTML = inputHipodogue.id;
    mascotaJugador = inputHipodogue.id;
  } else if (inputCapipepo.checked) {
    spamMascotaJugador.innerHTML = inputCapipepo.id;
    mascotaJugador = inputCapipepo.id;
  } else if (inputRatigueya.checked) {
    spamMascotaJugador.innerHTML = inputRatigueya.id;
    mascotaJugador = inputRatigueya.id;
  } else {
    alert("selecciona una mascota");
  }

  seleccionarMokepon(mascotaJugador);

  extraerAtaques(mascotaJugador);
  sectionVerMapa.style.display = "flex";
  iniciarMapa();
}

function seleccionarMokepon(mascotaJugador) {
  fetch(`http://localhost:8080/mokepon/${jugadorId}`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      mokepon: mascotaJugador,
    }),
  });
}

function extraerAtaques(mascotaJugador) {
  let ataques;
  for (let i = 0; i < mokepones.length; i++) {
    if (mascotaJugador === mokepones[i].nombre) {
      ataques = mokepones[i].ataques;
    }
  }

  mostrarAtaques(ataques);
}

function mostrarAtaques(ataques) {
  ataques.forEach((ataque) => {
    ataquesMokepon = ` <button id=${ataque.id} class="boton-de-ataque BAtaque">${ataque.nombre}</button>`;
    contenedorAtaques.innerHTML += ataquesMokepon;
  });

  botonFuego = document.getElementById("boton-fuego");
  botonAgua = document.getElementById("boton-agua");
  botonTierra = document.getElementById("boton-tierra");
  botones = document.querySelectorAll(".BAtaque");
}

function secuenciaAtaque() {
  botones.forEach((boton) => {
    boton.addEventListener("click", (e) => {
      if (e.target.textContent === "🔥") {
        ataqueJugador.push("fuego");
        console.log(ataqueJugador);
        boton.style.background = "#112f58";
        boton.disabled = true;
      } else if (e.target.textContent === "💧") {
        ataqueJugador.push("agua");
        console.log(ataqueJugador);
        boton.style.background = "#112f58";
        boton.disabled = true;
      } else {
        ataqueJugador.push("tierra");
        console.log(ataqueJugador);
        boton.style.background = "#112f58";
        boton.disabled = true;
      }
      ataqueAleatorioEnemigo();
    });
  });
}
function seleccionarMascotaEnemigo(enemigo) {
  spamMascotaEnemigo.innerHTML = enemigo.nombre;
  ataquesMokeponEnemigo = enemigo.ataques;
  secuenciaAtaque();
}

//function ataqueAleatorioEnemigo() {
// let ataqueAleatorio = aleatorio(0, ataquesMokeponEnemigo.length)
// if (ataqueAleatorio === 0 || ataqueAleatorio === 1) {
//  ataqueEnemigo.push('fuego')
// }
// else if (ataqueAleatorio === 3 || ataqueAleatorio === 4) {
// ataqueEnemigo.push('agua')
// }
// else {
//  ataqueEnemigo.push('tierra')
// }
// iniciarPelea()
//}

function iniciarPelea() {
  if (ataqueJugador.length === 5) {
    combate();
  }
}

function indexAmbosOponentes(jugador, enemigo) {
  indexAtaqueJugador = ataqueJugador[jugador];
  indexAtaqueEnemigo = ataqueEnemigo[enemigo];
}

function combate() {
  for (let index = 0; index < ataqueJugador.length; index++) {
    if (ataqueJugador[index] === ataqueEnemigo[index]) {
      indexAmbosOponentes(index, index);
      crearMensaje("empate");
    } else if (
      ataqueJugador[index] === "fuego" &&
      ataqueEnemigo[index] === "tierra"
    ) {
      indexAmbosOponentes(index, index);
      crearMensaje("ganaste");
      victoriasJugador++;
      spanVidasJugador.innerHTML = victoriasJugador;
    } else if (
      ataqueJugador[index] === "agua" &&
      ataqueEnemigo[index] === "fuego"
    ) {
      indexAmbosOponentes(index, index);
      crearMensaje("ganaste");
      victoriasJugador++;
      spanVidasJugador.innerHTML = victoriasJugador;
    } else if (
      ataqueJugador[index] === "tierra" &&
      ataqueEnemigo[index] === "agua"
    ) {
      indexAmbosOponentes(index, index);
      crearMensaje("ganaste");
      victoriasJugador++;
      spanVidasJugador.innerHTML = victoriasJugador;
    } else {
      indexAmbosOponentes(index, index);
      crearMensaje("perdiste");
      victoriasEnemigo++;
      spanVidasEnemigo.innerHTML = victoriasEnemigo;
    }

    revisarVidas();
  }
}
function revisarVidas() {
  if (victoriasJugador === victoriasEnemigo) {
    crearMensajeFinal("ES UN EMPATE 🤝");
  } else if (victoriasJugador > victoriasEnemigo) {
    crearMensajeFinal("FELICITACIONES ! GANASTE 🥳🥳🥳");
  } else {
    crearMensajeFinal(" LO SIENTO PERDISTE 😢😢😢 ");
  }
}

function crearMensaje(Resultado) {
  let nuevoAtaqueJugador = document.createElement("p");
  let nuevoAtaqueEnemigo = document.createElement("p");

  sectionMensajes.innerHTML = Resultado;
  nuevoAtaqueJugador.innerHTML = indexAtaqueJugador;
  nuevoAtaqueEnemigo.innerHTML = indexAtaqueEnemigo;

  ataqueDeJugador.appendChild(nuevoAtaqueJugador);
  ataqueDeEnemigo.appendChild(nuevoAtaqueEnemigo);
}

function crearMensajeFinal(ResultadoFinal) {
  sectionMensajes.innerHTML = ResultadoFinal;
  sectionReiniciar.style.display = "block";
}

function reiniciarJuego() {
  location.reload();
}

function aleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function pintarCanvas() {
  mascotaJugadorObjeto.x =
    mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadx;
  mascotaJugadorObjeto.y =
    mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidady;
  lienzo.clearRect(0, 0, mapa.width, mapa.height);
  lienzo.drawImage(mapaBackground, 0, 0, mapa.width, mapa.height);
  mascotaJugadorObjeto.pintarMokepon();
  enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y);

  mokeponesEnemigos.forEach(function (mokepon) {
    mokepon.pintarMokepon();
    revisarColision(mokepon);
  });
}

function enviarPosicion(x, y) {
  fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`, {
    method: "post",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      x,
      y,
    }),
  }).then(function (res) {
    if (res.ok) {
      res.json().then(function ({ enemigos }) {
        console.log(enemigos);
        mokeponesEnemigos.map(function (enemigo) {
          let mokeponEnemigo = null;
          const mokeponNombre = enemigo.mokepon.nombre || "";
          if (mokeponNombre === "Hipodoge") {
            mokeponEnemigo = new Mokepon(
              "Hipodogue",
              "./assets/ mokepons_mokepon_hipodoge_attack.png",
              5,
              "./assets/hipodoge.png"
            );
          } else if (mokeponNombre === "Capipepo") {
            mokeponEnemigo = new Mokepon(
              "Capipepo",
              "./assets/mokepons_mokepon_capipepo_attack.png",
              5,
              "./assets/capipepo.webp"
            );
          } else if (mokeponNombre === "Ratigueya") {
            mokeponEnemigo = new Mokepon(
              "Ratigueya",
              "./assets/mokepons_mokepon_ratigueya_attack.png",
              5,
              "./assets/ratigueya.png"
            );
          }

          mokeponEnemigo.x = enemigo.x;
          mokeponEnemigo.y = enemigo.y;
          return mokeponEnemigo;
        });
      });
    }
  });
}

function moverDerecha() {
  mascotaJugadorObjeto.velocidadx = 2;
}

function moverIzquierda() {
  mascotaJugadorObjeto.velocidadx = -2;
}

function moverAbajo() {
  mascotaJugadorObjeto.velocidady = 2;
}

function moverArriba() {
  mascotaJugadorObjeto.velocidady = -2;
}

function detenerMovimiento() {
  mascotaJugadorObjeto.velocidadx = 0;
  mascotaJugadorObjeto.velocidady = 0;
}

function sePresionaUnaTecla(event) {
  switch (event.key) {
    case "ArrowUp":
      moverArriba();
      break;
    case "ArrowDown":
      moverAbajo();
      break;
    case "ArrowLeft":
      moverIzquierda();
      break;
    case "ArrowRight":
      moverDerecha();
      break;

    default:
      break;
  }
}

function iniciarMapa() {
  //mapa.width = 500
  // mapa.height = 300
  intervalo = setInterval(pintarCanvas, 20);
  mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador);
  window.addEventListener("keydown", sePresionaUnaTecla);
  window.addEventListener("keyup", detenerMovimiento);
}

function obtenerObjetoMascota() {
  for (let i = 0; i < mokepones.length; i++) {
    if (mascotaJugador === mokepones[i].nombre) {
      return mokepones[i];
    }
  }
}

function revisarColision(enemigo) {
  const arribaEnemigo = enemigo.y;
  const abajoEnemigo = enemigo.y + enemigo.alto;
  const derechaEnemigo = enemigo.x + enemigo.ancho;
  const izquierdaEnemigo = enemigo.x;

  const arribaMascota = mascotaJugadorObjeto.y;
  const abajoMascota = mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto;
  const derechaMascota = mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho;
  const izquierdaMascota = mascotaJugadorObjeto.x;
  if (
    abajoMascota < arribaEnemigo ||
    arribaMascota > abajoEnemigo ||
    derechaMascota < izquierdaEnemigo ||
    izquierdaMascota > derechaEnemigo
  ) {
    return;
  }
  console.log(enemigo);
  clearInterval(intervalo);
  detenerMovimiento();
  sectionSeleccionarAtaque.style.display = "flex";
  sectionVerMapa.style.display = "none";
  seleccionarMascotaEnemigo(enemigo);
}

window.addEventListener("load", iniciarJuego());
