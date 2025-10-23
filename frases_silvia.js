// Dedicatoria
window.DEDICATION = "Este libro guarda cada latido de nuestro amor, para ti, mi princesa Silvia 💜 — Aldair";

// Frases base románticas (100 frases únicas)
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
    "Hoy entiendo que cuando todo se derrumba la fe no es creer que nada malo pasará sino confiar en que juntos podemos reconstruir",
    "Descubrí que el amor verdadero no es perfecto pero es constante",
    "Contigo aprendí que las palabras tienen el poder de construir puentes o cavar abismos",
    "Esta mañana confirmé que la paciencia es amor en acción esperando sin exigir",
    "Hoy reconozco que el respeto es la base sobre la que se construye todo lo demás",
    "Descubrí que perdonar no es debilidad sino la mayor fortaleza que existe",
    "Contigo aprendí que escuchar es más que oír palabras: es entender silencios también",
    "Esta tarde entendí que la vulnerabilidad no es debilidad sino valentía desnuda",
    "Hoy celebro que el amor no es encontrar a alguien perfecto sino ver perfección en sus imperfecciones",
    "Al mirarte descubrí que la belleza más profunda está en la esencia no en la apariencia",
    "Esta noche confirmé que la confianza se construye con acciones no con promesas vacías",
    "Contigo aprendí que amar es también dejar ir el control y confiar en el proceso",
    "Hoy reconozco que el perdón libera más al que perdona que al perdonado",
    "Descubrí que la gratitud transforma lo que tenemos en suficiente",
    "Esta mañana entendí que el amor verdadero no completa sino que complementa",
    "Al despertar junto a ti confirmé que cada nuevo día es una oportunidad para amarte mejor",
    "Contigo aprendí que la intimidad se construye en los pequeños momentos cotidianos",
    "Hoy celebro que descubrí que el amor no es un sentimiento sino una decisión diaria",
    "Esta tarde reconocí que la comunicación es el puente que mantiene unidos dos mundos",
    "Descubrí que amar es celebrar tus logros como si fueran míos",
    "Contigo entendí que el amor verdadero acepta sin juzgar escucha sin interrumpir",
    "Hoy confirmé que la paciencia es amor esperando su momento perfecto",
    "Esta noche aprendí que perdonar es soltar la carga del resentimiento",
    "Al mirarte descubrí que la belleza más grande está en tu esencia única",
    "Contigo reconocí que el respeto es la columna vertebral de todo amor duradero",
    "Hoy entendí que la confianza es el cimiento sobre el cual construimos",
    "Esta mañana celebro que aprendí que amar es también dar espacio para crecer",
    "Descubrí que la gratitud multiplica el amor en formas inexplicables",
    "Contigo confirmé que el amor verdadero no compite sino que colabora",
    "Hoy reconozco que la vulnerabilidad es el camino hacia la intimidad profunda",
    "Mi corazón late solo por ti y cada latido pronuncia tu nombre con amor infinito",
    "Eres la razón por la que creo en los milagros y en que los sueños se hacen realidad",
    "Tu sonrisa ilumina mis días más oscuros y tu amor me da fuerzas para seguir adelante",
    "Contigo aprendí que el amor verdadero no conoce distancias ni barreras imposibles de superar",
    "Cada momento a tu lado es un tesoro que guardo en mi corazón para siempre",
    "Eres mi persona favorita en este mundo y no imagino mi vida sin ti a mi lado",
    "Tu amor me ha transformado en la mejor versión de mí mismo y te lo agradezco infinitamente",
    "Contigo descubrí que el paraíso no es un lugar sino un sentimiento que se vive juntos",
    "Eres mi inspiración mi motivación y la razón por la que cada día tiene sentido especial",
    "Tu presencia en mi vida es el mejor regalo que el universo pudo darme jamás",
    "Contigo aprendí que amar es entregar el corazón sin esperar nada a cambio solamente amar",
    "Eres la melodía más hermosa que mi corazón ha escuchado y quiero escucharla por siempre",
    "Tu amor es como un faro que guía mi camino en las noches más oscuras de mi vida",
    "Contigo descubrí que la felicidad se mide en momentos compartidos no en cosas materiales",
    "Eres mi complemento perfecto la pieza que faltaba para completar mi rompecabezas vital",
    "Tu amor me ha enseñado que rendirse nunca es una opción cuando se lucha por lo que se ama",
    "Contigo aprendí que el amor verdadero crece con el tiempo y se fortalece con cada obstáculo",
    "Eres la respuesta a todas las preguntas que mi corazón hacía antes de conocerte amor",
    "Tu presencia transforma lo ordinario en extraordinario y lo simple en algo mágico y especial",
    "Contigo descubrí que amar es también respetar los espacios y los tiempos de cada uno",
    "Eres mi refugio seguro donde puedo ser yo mismo sin máscaras ni pretensiones falsas",
    "Tu amor me ha dado el valor para enfrentar mis miedos y perseguir mis sueños más grandes",
    "Contigo aprendí que la comunicación honesta es la base de cualquier relación duradera y sana",
    "Eres la razón por la que cada amanecer tiene un color diferente más brillante y esperanzador",
    "Tu amor me ha mostrado que la paciencia y la comprensión son claves para construir juntos",
    "Contigo descubrí que amar es también aprender a perdonar y dejar ir el pasado doloroso",
    "Eres mi compañero de aventuras mi confidente y mi mejor amigo en esta travesía llamada vida",
    "Tu presencia me da paz en medio del caos y me recuerda que todo estará bien contigo",
    "Contigo aprendí que el amor verdadero no busca cambiar sino aceptar y valorar al otro",
    "Eres la inspiración detrás de cada sonrisa cada logro y cada momento de felicidad pura",
    "Tu amor me ha enseñado que la vulnerabilidad es fortaleza cuando se comparte con la persona correcta",
    "Contigo descubrí que amar es construir un hogar emocional donde ambos se sientan seguros siempre",
    "Eres mi razón para creer que el amor verdadero existe y vale la pena esperar por él",
    "Tu presencia en mi vida es la prueba de que los cuentos de hadas pueden hacerse realidad",
    "Contigo aprendí que el amor es un viaje no un destino y quiero recorrerlo contigo para siempre",
    "Eres la persona con la que quiero crear mil recuerdos más y vivir mil aventuras nuevas",
    "Tu amor me ha dado el coraje para ser auténtico y mostrarme tal como soy sin miedo",
    "Contigo descubrí que amar es también celebrar las diferencias y aprender del otro cada día",
    "Eres mi roca mi apoyo incondicional y la persona en quien siempre puedo confiar plenamente",
    "Tu presencia ilumina mi mundo y me recuerda que la vida es más hermosa cuando se comparte",
    "Contigo aprendí que el amor verdadero no es posesión sino libertad compartida con alegría",
    "Eres la razón por la que creo en segundas oportunidades y en que todo pasa por algo",
    "Tu amor me ha enseñado que la gratitud diaria fortalece los lazos y mantiene viva la llama",
    "Contigo descubrí que amar es también apoyar los sueños del otro aunque signifique sacrificio personal",
    "Eres mi lugar favorito para estar mi persona favorita para hablar y mi razón para sonreír",
    "Tu presencia me hace mejor persona cada día y me inspira a dar lo mejor de mí",
    "Contigo aprendí que el amor verdadero es paciente amable y nunca se rinde ante las adversidades",
    "Eres la evidencia de que vale la pena esperar por la persona correcta en el momento adecuado"
];

// Prefijos románticos
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

// Sufijos románticos
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

// Conectores adicionales
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
    
    // Alternar estilos cada 500 frases
    if (i % 500 < 250) {
        frase += PREFIJOS[prefijoIndex] + FRASES_BASE[baseIndex] + SUFIJOS[sufijoIndex];
    } else {
        frase += FRASES_BASE[baseIndex] + CONECTORES[conectorIndex] + " el amor nos hace crecer juntos" + SUFIJOS[sufijoIndex];
    }
    
    window.PHRASES.push(frase);
}

console.log(`✅ ${window.PHRASES.length} frases generadas para Silvia 💕`);
