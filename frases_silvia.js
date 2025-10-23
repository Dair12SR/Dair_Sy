// Dedicatoria
window.DEDICATION = "Este libro guarda cada latido de nuestro amor, para ti, mi princesa Silvia 💜 — Aldair";

// Frases base románticas (100 frases únicas creadas para Silvia)
const FRASES_BASE = [
    "Cuando se nubla la fe yo recuerdo que confirmé que la belleza es la forma en que me miras cuando el mundo hace ruido; entonces prometo pedir permiso antes de entrar a tu corazón",
    "A tu lado el tiempo aprende a escuchar, recordé que la fe es quedarse incluso cuando tiembla el suelo y confiar en nosotros",
    "Hoy sé con certeza que descubrí que la paz no está afuera: empieza en tu abrazo y se expande a todo lo que miro",
    "En tu presencia comprendí que el verdadero hogar no es un lugar, es el latido sincronizado de dos corazones",
    "Cuando miro atrás descubro que la vida me enseñó que amar es aceptar tus silencios tanto como tus palabras",
    "Hoy celebro que aprendí que no necesito tenerlo todo resuelto para amarte bien cada día",
    "Contigo entendí que amor verdadero es ese que te mira cuando todo duele y aun así se queda",
    "En los días grises descubrí que tu risa es la melodía que hace bailar mi alma cansada",
    "Me di cuenta que nuestra historia no está escrita en grandes gestos sino en esos detalles que nadie más ve",
    "Hoy reconozco que me enseñaste que amar no es retener sino soltar confiando en que volverás",
    "Esta mañana desperté sabiendo que confirmé que el perdón no es olvidar sino decidir no cargar más el peso",
    "Hoy comprendí que descubrí que la gratitud transforma lo ordinario en extraordinario",
    "Al mirarte descubro que aprendí que la intimidad no es solo cercanía física sino almas que se reconocen",
    "Esta tarde entendí que recordé que las palabras tienen poder para sanar o destruir",
    "Hoy celebro que confirmé que el tiempo juntos es el regalo más valioso que podemos darnos",
    "En tu abrazo descubrí que aprendí que no necesito ser fuerte siempre para ser valiente",
    "Esta noche comprendo que entendí que el amor se nutre de pequeñas elecciones diarias",
    "Contigo descubro que recordé que la risa compartida es medicina para el alma cansada",
    "Hoy reconozco que confirmé que no hay transformación sin incomodidad",
    "Al verte sonreír aprendí que descubrí que la belleza está en los gestos simples",
    "Mi corazón late solo por ti y cada latido pronuncia tu nombre con amor infinito mi princesa",
    "Eres la razón por la que creo en los milagros y en que los sueños se hacen realidad cada día",
    "Tu sonrisa ilumina mis días más oscuros y tu amor me da fuerzas para seguir adelante siempre",
    "Contigo aprendí que el amor verdadero no conoce distancias ni barreras imposibles de superar nunca",
    "Cada momento a tu lado es un tesoro que guardo en mi corazón para siempre mi amor",
    "Eres mi persona favorita en este mundo y no imagino mi vida sin ti a mi lado jamás",
    "Tu amor me ha transformado en la mejor versión de mí mismo y te lo agradezco infinitamente amor",
    "Contigo descubrí que el paraíso no es un lugar sino un sentimiento que se vive juntos hermosa",
    "Eres mi inspiración mi motivación y la razón por la que cada día tiene sentido especial para mí",
    "Tu presencia en mi vida es el mejor regalo que el universo pudo darme jamás mi reina",
    "Contigo aprendí que amar es entregar el corazón sin esperar nada a cambio solamente amar sin límites",
    "Eres la melodía más hermosa que mi corazón ha escuchado y quiero escucharla por siempre mi vida",
    "Tu amor es como un faro que guía mi camino en las noches más oscuras de mi vida princesa",
    "Contigo descubrí que la felicidad se mide en momentos compartidos no en cosas materiales sin valor",
    "Eres mi complemento perfecto la pieza que faltaba para completar mi rompecabezas vital hermosa",
    "Tu amor me ha enseñado que rendirse nunca es una opción cuando se lucha por lo que se ama de verdad",
    "Contigo aprendí que el amor verdadero crece con el tiempo y se fortalece con cada obstáculo amor mío",
    "Eres la respuesta a todas las preguntas que mi corazón hacía antes de conocerte amor de mi vida",
    "Tu presencia transforma lo ordinario en extraordinario y lo simple en algo mágico y especial siempre",
    "Contigo descubrí que amar es también respetar los espacios y los tiempos de cada uno con paciencia",
    "Eres mi refugio seguro donde puedo ser yo mismo sin máscaras ni pretensiones falsas mi amor",
    "Tu amor me ha dado el valor para enfrentar mis miedos y perseguir mis sueños más grandes hermosa",
    "Contigo aprendí que la comunicación honesta es la base de cualquier relación duradera y sana siempre",
    "Eres la razón por la que cada amanecer tiene un color diferente más brillante y esperanzador mi vida",
    "Tu amor me ha mostrado que la paciencia y la comprensión son claves para construir juntos nuestro futuro",
    "Contigo descubrí que amar es también aprender a perdonar y dejar ir el pasado doloroso que nos limita",
    "Eres mi compañero de aventuras mi confidente y mi mejor amigo en esta travesía llamada vida hermosa",
    "Tu presencia me da paz en medio del caos y me recuerda que todo estará bien contigo a mi lado",
    "Contigo aprendí que el amor verdadero no busca cambiar sino aceptar y valorar al otro completamente",
    "Eres la inspiración detrás de cada sonrisa cada logro y cada momento de felicidad pura que vivo",
    "Tu amor me ha enseñado que la vulnerabilidad es fortaleza cuando se comparte con la persona correcta siempre",
    "Contigo descubrí que amar es construir un hogar emocional donde ambos se sientan seguros siempre juntos",
    "Eres mi razón para creer que el amor verdadero existe y vale la pena esperar por él mi princesa",
    "Tu presencia en mi vida es la prueba de que los cuentos de hadas pueden hacerse realidad hermosa",
    "Contigo aprendí que el amor es un viaje no un destino y quiero recorrerlo contigo para siempre amor",
    "Eres la persona con la que quiero crear mil recuerdos más y vivir mil aventuras nuevas juntos siempre",
    "Tu amor me ha dado el coraje para ser auténtico y mostrarme tal como soy sin miedo al rechazo",
    "Contigo descubrí que amar es también celebrar las diferencias y aprender del otro cada día mi vida",
    "Eres mi roca mi apoyo incondicional y la persona en quien siempre puedo confiar plenamente amor",
    "Tu presencia ilumina mi mundo y me recuerda que la vida es más hermosa cuando se comparte contigo",
    "Contigo aprendí que el amor verdadero no es posesión sino libertad compartida con alegría y respeto",
    "Eres la razón por la que creo en segundas oportunidades y en que todo pasa por algo en la vida",
    "Tu amor me ha enseñado que la gratitud diaria fortalece los lazos y mantiene viva la llama hermosa",
    "Contigo descubrí que amar es también apoyar los sueños del otro aunque signifique sacrificio personal a veces",
    "Eres mi lugar favorito para estar mi persona favorita para hablar y mi razón para sonreír siempre",
    "Tu presencia me hace mejor persona cada día y me inspira a dar lo mejor de mí constantemente",
    "Contigo aprendí que el amor verdadero es paciente amable y nunca se rinde ante las adversidades duras",
    "Eres la evidencia de que vale la pena esperar por la persona correcta en el momento adecuado perfecto",
    "Tu mirada tiene el poder de calmar mis tormentas y llenar mi mundo de paz absoluta mi amor",
    "Contigo aprendí que los silencios también hablan y a veces dicen más que mil palabras juntas",
    "Eres el sueño que nunca supe que tenía hasta que apareciste en mi vida para quedarte hermosa",
    "Tu risa es mi canción favorita y cada vez que la escucho mi corazón baila de felicidad pura",
    "Contigo descubrí que el amor no se trata de perfección sino de aceptación total del otro siempre",
    "Eres mi razón para despertar cada mañana con una sonrisa y enfrentar el día con energía",
    "Tu amor me enseñó que la valentía no es no tener miedo sino enfrentarlo contigo a mi lado",
    "Contigo aprendí que los pequeños gestos de amor valen más que las grandes promesas vacías sin acción",
    "Eres mi ancla en los días de tormenta y mis alas en los momentos de calma total amor",
    "Tu presencia convierte los momentos ordinarios en recuerdos extraordinarios que atesoraré por siempre",
    "Contigo descubrí que amar es también saber pedir perdón y perdonar con el corazón abierto siempre",
    "Eres la prueba viviente de que Dios escucha las oraciones del corazón sincero mi princesa hermosa",
    "Tu amor me ha enseñado que la paciencia no es esperar sino mantener la fe mientras esperas juntos",
    "Contigo aprendí que el respeto es la base fundamental sobre la cual se construye todo lo demás",
    "Eres mi hogar no por el lugar donde estás sino porque donde estás tú yo me siento en casa",
    "Tu sonrisa tiene el poder mágico de iluminar incluso mis días más grises y oscuros del alma",
    "Contigo descubrí que el amor verdadero no es encontrar a alguien perfecto sino hacerlo perfecto juntos",
    "Eres mi mejor decisión mi mayor bendición y la razón de mi felicidad completa cada día",
    "Tu amor me ha mostrado que vale la pena arriesgarse cuando se tiene algo tan valioso que proteger",
    "Contigo aprendí que amar es también dar espacio para crecer individualmente mientras crecemos juntos siempre",
    "Eres la razón por la que creo en el destino y en que todo pasa cuando tiene que pasar",
    "Tu presencia me recuerda que la vida es un regalo precioso y que cada día contigo es un tesoro",
    "Contigo descubrí que el amor no se mide en tiempo sino en profundidad e intensidad de sentimientos",
    "Eres mi inspiración diaria mi motivación constante y la fuerza que me impulsa a ser mejor persona",
    "Tu amor me ha enseñado que la verdadera riqueza no está en lo que tienes sino en quien tienes",
    "Contigo aprendí que el amor verdadero trasciende lo físico y conecta almas a un nivel espiritual profundo",
    "Eres mi paz en medio del caos mi luz en la oscuridad y mi esperanza en los momentos difíciles",
    "Tu presencia me recuerda cada día que elegí bien y que volvería a elegirte mil veces más mi amor",
    "Contigo descubrí que amar es un verbo que requiere acción constante no solo palabras bonitas sin sentido",
    "Eres mi confidente mi cómplice mi amante y mi mejor amiga todo en una sola persona especial"
];

// Prefijos románticos variados
const PREFIJOS = [
    "Mi amor, ",
    "Silvia hermosa, ",
    "Princesa mía, ",
    "Amor de mi vida, ",
    "Mi reina, ",
    "Tesoro mío, ",
    "Mi cielo, ",
    "Corazón, ",
    "Mi vida, ",
    "Bella mía, ",
    "Luz de mis ojos, ",
    "Mi todo, ",
    "Ángel mío, ",
    "Mi adorada, ",
    "Amor eterno, ",
    "Mi estrella, ",
    "Dulce mía, ",
    "Mi sol, ",
    "Preciosa, ",
    "Mi felicidad, "
];

// Sufijos románticos con emojis
const SUFIJOS = [
    " Te amo infinitamente 💕",
    " Eres mi luz y mi guía 💜",
    " Eres mi todo y más ❤️",
    " Mi amor eterno para ti 💖",
    " Para siempre juntos mi amor ✨",
    " Eres mi felicidad completa 🌸",
    " Te adoro con toda mi alma 💗",
    " Eres mi destino hermoso 🌟",
    " Contigo soy feliz siempre 💝",
    " Eres mi razón de ser 🦋",
    " Te amo más cada día 💞",
    " Eres mi universo entero 🌙",
    " Para ti todo mi amor 💓",
    " Juntos por la eternidad 🌈",
    " Eres mi sueño hecho realidad 💫",
    " Te llevo en mi corazón 💘",
    " Eres mi complemento perfecto ✨",
    " Te amaré por siempre 💕",
    " Eres mi mayor tesoro 💎",
    " Contigo todo es mejor 🌺",
    " Eres mi inspiración diaria 🌻",
    " Te amo sin condiciones 💖",
    " Eres mi razón para sonreír 😊",
    " Mi corazón es tuyo 💝",
    " Eres mi persona favorita 💜",
    " Te necesito en mi vida 💗",
    " Eres mi amor verdadero 💕",
    " Contigo soy yo mismo ✨",
    " Eres mi mejor decisión 💖",
    " Te amaré toda la vida 💞"
];

// Conectores adicionales para variedad
const CONECTORES = [
    " porque contigo descubrí que",
    " y por eso prometo",
    " entonces comprendo que",
    " así que te prometo",
    " por lo tanto",
    " y es por eso que",
    " de esta manera",
    " así pues",
    " por ello",
    " en consecuencia"
];

// Generar 3650 frases únicas
window.PHRASES = [];

for (let i = 0; i < 3650; i++) {
    const diaNum = i + 1;
    const baseIndex = i % FRASES_BASE.length;
    const prefijoIndex = Math.floor(i / FRASES_BASE.length) % PREFIJOS.length;
    const sufijoIndex = Math.floor(i / (FRASES_BASE.length * PREFIJOS.length)) % SUFIJOS.length;
    const conectorIndex = Math.floor(i / (FRASES_BASE.length * PREFIJOS.length * SUFIJOS.length)) % CONECTORES.length;
    
    let frase = `Día ${diaNum} — `;
    
    // Alternar estilos cada 500 frases para mayor variedad
    if (i % 500 < 250) {
        frase += PREFIJOS[prefijoIndex] + FRASES_BASE[baseIndex] + SUFIJOS[sufijoIndex];
    } else {
        frase += FRASES_BASE[baseIndex] + CONECTORES[conectorIndex] + " el amor nos hace crecer juntos cada día" + SUFIJOS[sufijoIndex];
    }
    
    window.PHRASES.push(frase);
}

console.log(`✅ ${window.PHRASES.length} frases románticas generadas para Silvia 💕`);
