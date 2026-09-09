import { prisma } from "../src/lib/prisma";

async function main() {
	await prisma.userUsage.deleteMany();
	await prisma.itemMenuSemanal.deleteMany();
	await prisma.menuSemanal.deleteMany();
	await prisma.ingredienteReceta.deleteMany();
	await prisma.favorito.deleteMany();
	await prisma.receta.deleteMany();

	const userId = "24dbf16e-a6b0-4ad6-8df3-da766a04d7e1";
	const user = await prisma.user.upsert({
		where: { email: "mannlex@gmail.com" },
		update: {},
		create: {
			id: userId,
			email: "mannlex@gmail.com",
			nombre: "Manuel Alejandro",
		},
	});

	// Crear o reiniciar el uso inicial del usuario para la prueba de límites
	await prisma.userUsage.upsert({
		where: { identifier: user.id },
		update: {
			dailyCount: 0,
			lastRequestDate: new Date(),
		},
		create: {
			identifier: user.id,
			userId: user.id,
			dailyCount: 0,
			lastRequestDate: new Date(),
		},
	});

	await prisma.appConfig.upsert({
		where: { key: "daily_recipe_limit" },
		update: {},
		create: {
			key: "daily_recipe_limit",
			value: 5,
		},
	});

	const recetasData = [
		// Desayunos
		{
			titulo: "Huevos Rancheros Tradicionales",
			slug: "huevos-rancheros-tradicionales",
			descripcion:
				"Huevos estrellados sobre tortilla frita bañados en salsa roja casera de jitomate y chile serrano.",
			instrucciones:
				"<p><strong>1. Preparar la salsa:</strong> Cocina 3 jitomates y 1 chile serrano en agua hirviendo hasta que estén suaves. Licúa con un diente de ajo y sal al gusto.</p>" +
				"<p><strong>2. Freír las tortillas:</strong> Calienta 2 cucharadas de aceite en un sartén y pasa las 4 tortillas de maíz ligeramente por el aceite caliente hasta que estén flexibles pero firmes, sin dorar de más. Escúrrelas en papel absorbente.</p>" +
				"<p><strong>3. Cocinar los huevos:</strong> En el mismo sartén con un poco de aceite, cocina los 4 huevos en forma de huevos estrellados, cuidando que la yema quede tierna.</p>" +
				"<p><strong>4. Montar el plato:</strong> Coloca dos tortillas fritas por plato, pon encima los huevos estrellados y baña generosamente con la salsa roja caliente.</p>",
			tiempoPreparacionInt: 20,
			porciones: 2,
			categoria: "Desayuno",
			ingredientes: [
				{ nombre: "Huevos", cantidad: "4 piezas" },
				{ nombre: "Tortillas de maíz", cantidad: "4 piezas" },
				{ nombre: "Jitomate", cantidad: "3 piezas" },
				{ nombre: "Chile serrano", cantidad: "1 pieza" },
				{ nombre: "Aceite", cantidad: "2 cucharadas" },
			],
		},
		{
			titulo: "Hot Cakes Esponjosos",
			slug: "hot-cakes-esponjosos",
			descripcion:
				"Panqueques ligeros y doraditos, ideales para un desayuno rápido y reconfortante.",
			instrucciones:
				"<p><strong>1. Mezclar ingredientes:</strong> En un tazón grande, integra 1 taza de harina para hot cakes, 3/4 de taza de leche, 1 huevo y un chorrito de vainilla hasta obtener una mezcla homogénea y sin grumos.</p>" +
				"<p><strong>2. Calentar el sartén:</strong> Derrite un poco de mantequilla (de los 30 g totales) a fuego medio en un sartén antiadherente.</p>" +
				"<p><strong>3. Cocinar:</strong> Vierte un cucharón de la mezcla al centro del sartén. Espera a que comiencen a formarse pequeñas burbujas en la superficie y los bordes se vean ligeramente secos (aproximadamente 2 minutos).</p>" +
				"<p><strong>4. Voltear:</strong> Con una pala, voltea el hot cake y cocina por 1 minuto más hasta que esté bien doradito. Repite con el resto de la mezcla.</p>",
			tiempoPreparacionInt: 25,
			porciones: 3,
			categoria: "Desayuno",
			ingredientes: [
				{ nombre: "Harina para hot cakes", cantidad: "1 taza" },
				{ nombre: "Leche", cantidad: "3/4 taza" },
				{ nombre: "Huevo", cantidad: "1 pieza" },
				{ nombre: "Mantequilla", cantidad: "30 g" },
			],
		},
		{
			titulo: "Chilaquiles Verdes con Pollo",
			slug: "chilaquiles-verdes-con-pollo",
			descripcion:
				"Totopos crujientes bañados en salsa verde cocida, decorados con pollo deshebrado, crema y queso fresco.",
			instrucciones:
				"<p><strong>1. Hervir los ingredientes de la salsa:</strong> En una olla con agua, pon 500 g de tomatillo verde y chiles al gusto hasta que cambien de color. Licúalos con ajo y cebolla.</p>" +
				"<p><strong>2. Sazonar la salsa:</strong> En una sartén honda, calienta un poco de aceite, vierte la salsa licuada y sazona con sal. Deja hervir a fuego medio por 5 minutos.</p>" +
				"<p><strong>3. Integrar los totopos:</strong> Agrega los 200 g de totopos de maíz directamente a la salsa verde y mezcla con cuidado durante unos segundos para que se impregnen sin perder su textura crujiente.</p>" +
				"<p><strong>4. Servir:</strong> Sirve inmediatamente en el plato y acompaña con 1 taza de pechuga de pollo deshebrada, crema ácida y queso fresco al gusto.</p>",
			tiempoPreparacionInt: 30,
			porciones: 2,
			categoria: "Desayuno",
			ingredientes: [
				{ nombre: "Totopos de maíz", cantidad: "200 g" },
				{ nombre: "Tomatillo verde", cantidad: "500 g" },
				{ nombre: "Pechuga de pollo deshebrada", cantidad: "1 taza" },
				{ nombre: "Crema ácida", cantidad: "4 cucharadas" },
				{ nombre: "Queso fresco", cantidad: "100 g" },
			],
		},
		{
			titulo: "Omelette de Espinacas y Queso",
			slug: "omelette-de-espinacas-y-queso",
			descripcion:
				"Huevos batidos suavemente y rellenos de espinacas frescas salteadas con queso manchego fundido.",
			instrucciones:
				"<p><strong>1. Batir el huevo:</strong> En un tazón, bate enérgicamente los 3 huevos con una pizca de sal y pimienta hasta que estén bien integrados.</p>" +
				"<p><strong>2. Saltear espinacas:</strong> En una sartén con 1 cucharada de mantequilla, saltea 1 taza de espinacas frescas hasta que reduzcan su tamaño. Retíralas un momento.</p>" +
				"<p><strong>3. Cocinar la base:</strong> Vierte el huevo batido en el mismo sartén a fuego medio-bajo. Mueve ligeramente el sartén para que se distribuya de manera uniforme.</p>" +
				"<p><strong>4. Rellenar y doblar:</strong> Cuando la parte superior esté casi cuajada, coloca las espinacas y los 50 g de queso manchego rallado en una mitad. Dobla el omelette con la ayuda de una pala y deja cocinar un minuto más hasta que el queso se derrita.</p>",
			tiempoPreparacionInt: 15,
			porciones: 1,
			categoria: "Desayuno",
			ingredientes: [
				{ nombre: "Huevos", cantidad: "3 piezas" },
				{ nombre: "Espinacas frescas", cantidad: "1 taza" },
				{ nombre: "Queso manchego rallado", cantidad: "50 g" },
				{ nombre: "Mantequilla", cantidad: "1 cucharada" },
			],
		},
		{
			titulo: "Licuado de Plátano y Avena",
			slug: "licuado-de-platano-y-avena",
			descripcion:
				"Bebida energética, nutritiva y rápida, perfecta para las mañanas con prisa.",
			instrucciones:
				"<p><strong>1. Cortar la fruta:</strong> Pela los 2 plátanos maduros y córtalos en rodajas medianas para facilitar el licuado.</p>" +
				"<p><strong>2. Añadir los secos y líquidos:</strong> Coloca en el vaso de la licuadora el plátano, las 4 cucharadas de avena, los 500 ml de leche y una pizca de canela en polvo.</p>" +
				"<p><strong>3. Licuar:</strong> Procesa a velocidad alta durante aproximadamente 1 minuto o hasta que no queden grumos y la mezcla esté espumosa.</p>" +
				"<p><strong>4. Servir:</strong> Sirve en vasos altos inmediatamente y disfruta frío.</p>",
			tiempoPreparacionInt: 5,
			porciones: 2,
			categoria: "Desayuno",
			ingredientes: [
				{ nombre: "Plátano maduro", cantidad: "2 piezas" },
				{ nombre: "Avena", cantidad: "4 cucharadas" },
				{ nombre: "Leche", cantidad: "500 ml" },
				{ nombre: "Canela en polvo", cantidad: "1 pizca" },
			],
		},

		// Comidas
		{
			titulo: "Tacos al Pastor Caseros",
			slug: "tacos-al-pastor-caseros",
			descripcion:
				"Carne de cerdo marinada con pasta de achiote y especias, cocinada en casa con trozos de piña fresca.",
			instrucciones:
				"<p><strong>1. Marinar la carne:</strong> Disuelve los 50 g de achiote con un poco de jugo de naranja, vinagre, ajo, orégano y sal. Unta esta mezcla sobre 1 kg de carne de cerdo cortada en trozos pequeños y deja reposar por al menos 30 minutos.</p>" +
				"<p><strong>2. Cocinar la carne:</strong> Calienta un sartén grande o una plancha a fuego medio-alto con un poco de aceite. Agrega la carne marinada y cocina hasta que esté bien dorada por fuera y cocida por dentro.</p>" +
				"<p><strong>3. Integrar la piña:</strong> Añade los 200 g de piña fresca picada en cubos pequeños directamente a la carne en los últimos minutos de cocción para que tome un sabor ligeramente caramelizado.</p>" +
				"<p><strong>4. Armar los tacos:</strong> Calienta las 12 tortillas de maíz, sirve una porción generosa de la carne al pastor con piña, y acompaña con cilantro y cebolla finamente picados.</p>",
			tiempoPreparacionInt: 45,
			porciones: 4,
			categoria: "Comida",
			ingredientes: [
				{ nombre: "Carne de cerdo", cantidad: "1 kg" },
				{ nombre: "Achiote", cantidad: "50 g" },
				{ nombre: "Piña fresca", cantidad: "200 g" },
				{ nombre: "Tortillas de maíz", cantidad: "12 piezas" },
			],
		},
		{
			titulo: "Pollo a la Plancha con Verduras",
			slug: "pollo-a-la-plancha-con-verduras",
			descripcion:
				"Pechuga de pollo jugosa sazonada a la plancha, acompañada de vegetales mixtos al vapor o salteados.",
			instrucciones:
				"<p><strong>1. Sazonar el pollo:</strong> Salpimienta las 2 piezas de pechuga de pollo y añade un toque de ajo en polvo y hierbas finas al gusto.</p>" +
				"<p><strong>2. Cocinar a la plancha:</strong> Calienta una plancha o sartén con unas gotas de aceite a fuego medio-alto. Coloca las pechugas y cocina de 5 a 7 minutos por lado hasta que estén bien cocidas y ligeramente doradas.</p>" +
				"<p><strong>3. Preparar las verduras:</strong> Corta 1 taza de brócoli, 1 zanahoria en rodajas y 1 calabacita en medias lunas.</p>" +
				"<p><strong>4. Saltear o cocer:</strong> Cocina las verduras en una sartén con un chorrito de agua o aceite hasta que queden al dente. Sirve el pollo acompañado de los vegetales calientes.</p>",
			tiempoPreparacionInt: 25,
			porciones: 2,
			categoria: "Comida",
			ingredientes: [
				{ nombre: "Pechuga de pollo", cantidad: "2 piezas" },
				{ nombre: "Brócoli", cantidad: "1 taza" },
				{ nombre: "Zanahoria", cantidad: "1 pieza" },
				{ nombre: "Calabacita", cantidad: "1 pieza" },
			],
		},
		{
			titulo: "Spaghetti a la Boloñesa",
			slug: "spaghetti-a-la-bolonesa",
			descripcion:
				"Clásica pasta italiana acompañada de una salsa espesa de jitomate y carne molida de res.",
			instrucciones:
				"<p><strong>1. Cocer la pasta:</strong> En una olla grande con abundante agua hirviendo y sal, agrega los 400 g de spaghetti. Cocina siguiendo las instrucciones del paquete hasta que esté al dente, luego escúrrela.</p>" +
				"<p><strong>2. Preparar la carne:</strong> En una sartén amplia, sofríe cebolla y ajo picados, añade los 500 g de carne molida de res y sazona con sal y pimienta. Cocina hasta que la carne pierda su color rojo.</p>" +
				"<p><strong>3. Agregar la salsa:</strong> Vierte las 2 tazas de puré de tomate sobre la carne y baja el fuego. Deja que la salsa hierva a fuego lento durante 10 minutos para que los sabores se mezclen.</p>" +
				"<p><strong>4. Servir:</strong> Mezcla la pasta con la salsa boloñesa (o sirve la salsa por encima) y espolvorea queso parmesano al gusto.</p>",
			tiempoPreparacionInt: 35,
			porciones: 4,
			categoria: "Comida",
			ingredientes: [
				{ nombre: "Spaghetti", cantidad: "400 g" },
				{ nombre: "Carne molida de res", cantidad: "500 g" },
				{ nombre: "Puré de tomate", cantidad: "2 tazas" },
				{ nombre: "Queso parmesano", cantidad: "50 g" },
			],
		},
		{
			titulo: "Arroz con Pollo Estilo Casero",
			slug: "arroz-con-pollo-estilo-casero",
			descripcion:
				"Guiso tradicional de arroz absorbido en caldo de pollo con verduras mixtas y piezas jugosas.",
			instrucciones:
				"<p><strong>1. Dorar el arroz:</strong> En una cazuela con un poco de aceite, sofríe las 2 tazas de arroz blanco previamente lavado y escurrido hasta que tome un tono ligeramente dorado.</p>" +
				"<p><strong>2. Añadir líquidos y verduras:</strong> Vierte las 4 tazas de caldos de pollo caliente, agrega 1 taza de chícharos con zanahoria y sazona con sal al gusto.</p>" +
				"<p><strong>3. Incorporar el pollo:</strong> Coloca las 4 piezas de pollo directamente hundidas en el arroz.</p>" +
				"<p><strong>4. Cocinar a fuego lento:</strong> Tapa la cazuela, baja el fuego al mínimo y deja cocinar sin destapar durante 20 minutos o hasta que el líquido se haya consumido por completo y el arroz esté suave.</p>",
			tiempoPreparacionInt: 40,
			porciones: 4,
			categoria: "Comida",
			ingredientes: [
				{ nombre: "Arroz blanco", cantidad: "2 tazas" },
				{ nombre: "Piezas de pollo", cantidad: "4 piezas" },
				{ nombre: "Caldo de pollo", cantidad: "4 tazas" },
				{ nombre: "Chícharos con zanahoria", cantidad: "1 taza" },
			],
		},
		{
			titulo: "Milanesa de Res con Papas",
			slug: "milanesa-de-res-con-papas",
			descripcion:
				"Bisteces de res empanizados con una capa crujiente, servidos con papas doradas en rodajas.",
			instrucciones:
				"<p><strong>1. Preparar las papas:</strong> Corta las 3 papas en rodajas o bastones, cuécelas por 5 minutos en agua hirviendo, escúrrelas y dóralas en un sartén con aceite hasta que estén crujientes. Sazona con sal.</p>" +
				"<p><strong>2. Empanizar:</strong> Pasa los 3 bisteces de res salpimentados primero por huevo batido y luego cúbrelos firmemente con 1 taza de pan molido presionando con las manos.</p>" +
				"<p><strong>3. Freír las milanesas:</strong> En un sartén con suficiente aceite caliente a fuego medio, fríe cada milanesa de 3 a 4 minutos por lado hasta que el empanizado esté bien dorado.</p>" +
				"<p><strong>4. Servir:</strong> Escúrrelas en papel absorbente y sirve calientes acompañadas de las papas.</p>",
			tiempoPreparacionInt: 30,
			porciones: 3,
			categoria: "Comida",
			ingredientes: [
				{ nombre: "Bistec de res", cantidad: "3 piezas" },
				{ nombre: "Pan molido", cantidad: "1 taza" },
				{ nombre: "Huevo", cantidad: "2 piezas" },
				{ nombre: "Papas", cantidad: "3 piezas" },
			],
		},
		{
			titulo: "Tacos de Pescado Estilo Baja",
			slug: "tacos-de-pescado-estilo-baja",
			descripcion:
				"Tiras de filete de pescado capeadas y fritas, servidas en tortilla con ensalada fresca de repollo.",
			instrucciones:
				"<p><strong>1. Hacer la mezcla para capear:</strong> Mezcla 1 taza de harina de trigo con 1/2 taza de cerveza, sal, pimienta y una pizca de polvo para hornear hasta conseguir una textura espesa tipo hot cake.</p>" +
				"<p><strong>2. Freír el pescado:</strong> Corta los 500 g de filete de pescado en tiras medianas. Sumerge cada tira en la mezcla y fríelas en abundante aceite caliente hasta que estén doradas y crujientes. Escúrrelas.</p>" +
				"<p><strong>3. Preparar la guarnición:</strong> Pica finamente 2 tazas de repollo y mézclalo con un poco de limón y sal.</p>" +
				"<p><strong>4. Armar:</strong> Coloca el pescado frito sobre tortillas calientes, añade el repollo y un toque de mayonesa.</p>",
			tiempoPreparacionInt: 35,
			porciones: 4,
			categoria: "Comida",
			ingredientes: [
				{ nombre: "Filete de pescado", cantidad: "500 g" },
				{ nombre: "Harina de trigo", cantidad: "1 taza" },
				{ nombre: "Cerveza", cantidad: "1/2 taza" },
				{ nombre: "Repollo picado", cantidad: "2 tazas" },
			],
		},
		{
			titulo: "Albóndigas en Caldillo",
			slug: "albondigas-en-caldillo",
			descripcion:
				"Jugosas bolitas de carne sazonadas con arroz y hierbas, cocinadas a fuego lento en un caldillo de jitomate.",
			instrucciones:
				"<p><strong>1. Preparar la carne:</strong> En un tazón, mezcla los 600 g de carne molida mixta con 1/2 taza de arroz cocido, un huevo, menta picada, sal y pimienta. Forma pequeñas bolitas (albóndigas) con las manos.</p>" +
				"<p><strong>2. Hacer el caldillo:</strong> Licúa 4 piezas de jitomate con ajo, cebolla y agua. Vierte la mezcla en una olla grande y calienta hasta que comience a hervir.</p>" +
				"<p><strong>3. Cocinar las albóndigas:</strong> Con mucho cuidado, introduce las albóndigas crudas dentro del caldillo hirviendo junto con 1 taza de calabacita picada en cubos.</p>" +
				"<p><strong>4. Cocinar a fuego medio:</strong> Tapa la olla y deja cocinar a fuego medio durante 30 minutos hasta que la carne esté perfectamente cocida y el caldo bien sazonado.</p>",
			tiempoPreparacionInt: 50,
			porciones: 4,
			categoria: "Comida",
			ingredientes: [
				{ nombre: "Carne molida mixta", cantidad: "600 g" },
				{ nombre: "Arroz cocido", cantidad: "1/2 taza" },
				{ nombre: "Jitomate", cantidad: "4 piezas" },
				{ nombre: "Calabacita picada", cantidad: "1 taza" },
			],
		},
		{
			titulo: "Enchiladas Suizas de Pollo",
			slug: "enchiladas-suizas-de-pollo",
			descripcion:
				"Tortillas de maíz enrolladas con pollo, cubiertas con salsa verde cremosa y gratinadas con queso.",
			instrucciones:
				"<p><strong>1. Preparar la salsa verde cremosa:</strong> Hierve 400 g de tomatillo verde y chiles. Licúalos con un chorro generoso de crema ácida, ajo, cebolla y sal.</p>" +
				"<p><strong>2. Rellenar las tortillas:</strong> Pasa las 9 tortillas de maíz ligeramente por aceite caliente para suavizarlas. Rellena cada una con 2 tazas de pechuga deshebrada de pollo y enrolla en forma de taquito.</p>" +
				"<p><strong>3. Bañar y cubrir:</strong> Acomoda las enchiladas en un refractario, báñalas por completo con la salsa verde cremosa y espolvorea encima los 150 g de queso manchego rallado.</p>" +
				"<p><strong>4. Gratinar:</strong> Hornea o calienta en el horno de microondas a potencia alta durante 5 a 8 minutos hasta que el queso esté completamente fundido y burbujeante.</p>",
			tiempoPreparacionInt: 40,
			porciones: 3,
			categoria: "Comida",
			ingredientes: [
				{ nombre: "Tortillas de maíz", cantidad: "9 piezas" },
				{ nombre: "Pechuga deshebrada", cantidad: "2 tazas" },
				{ nombre: "Tomatillo verde", cantidad: "400 g" },
				{ nombre: "Queso manchego", cantidad: "150 g" },
			],
		},

		// Cenas
		{
			titulo: "Sopa de Verduras Casera",
			slug: "sopa-de-verduras-casera",
			descripcion:
				"Caldo ligero, nutritivo y reconfortante preparado con una gran variedad de vegetales frescos.",
			instrucciones:
				"<p><strong>1. Picar los vegetales:</strong> Corta en cubos medianos 2 zanahorias, 2 papas y 1 chayote.</p>" +
				"<p><strong>2. Sofreír base:</strong> En una olla con un chorrito de aceite, sofríe un poco de cebolla y ajo picados. Agrega los cubos de verduras y revuelve durante 3 minutos.</p>" +
				"<p><strong>3. Agregar el caldo:</strong> Vierte los 1.5 litros de caldo de pollo dentro de la olla, sazona con sal y pimienta al gusto.</p>" +
				"<p><strong>4. Hervir:</strong> Deja que la sopa hierva a fuego medio-bajo durante 25 minutos o hasta que todas las verduras estén perfectamente suaves al pincharlas con un tenedor.</p>",
			tiempoPreparacionInt: 30,
			porciones: 4,
			categoria: "Cena",
			ingredientes: [
				{ nombre: "Zanahoria", cantidad: "2 piezas" },
				{ nombre: "Papa", cantidad: "2 piezas" },
				{ nombre: "Chayote", cantidad: "1 pieza" },
				{ nombre: "Caldo de pollo", cantidad: "1.5 litros" },
			],
		},
		{
			titulo: "Quesadillas de Flor de Calabaza",
			slug: "quesadillas-de-flor-de-calabaza",
			descripcion:
				"Antojito nocturno caliente elaborado con tortillas de maíz, queso Oaxaca y flor de calabaza fresca.",
			instrucciones:
				"<p><strong>1. Limpiar la flor:</strong> Retira los tallos duros y pistilos de 1 taza de flor de calabaza, y enjuágalas con cuidado escurriéndolas bien.</p>" +
				"<p><strong>2. Calentar la tortilla:</strong> Coloca una tortilla de maíz en un comal caliente a fuego medio.</p>" +
				"<p><strong>3. Añadir ingredientes:</strong> Pon una porción generosa de los 200 g de queso Oaxaca deshebrado y unas cuantas flores de calabaza encima de la mitad de la tortilla.</p>" +
				"<p><strong>4. Doblar y fundir:</strong> Dobla la tortilla a la mitad formando una quesadilla. Voltea constantemente en el comal hasta que la tortilla esté ligeramente dorada y el queso se funda por completo.</p>",
			tiempoPreparacionInt: 15,
			porciones: 2,
			categoria: "Cena",
			ingredientes: [
				{ nombre: "Tortillas de maíz", cantidad: "4 piezas" },
				{ nombre: "Queso Oaxaca", cantidad: "200 g" },
				{ nombre: "Flor de calabaza", cantidad: "1 taza" },
			],
		},
		{
			titulo: "Tostadas de Pollo Deshebrado",
			slug: "tostadas-de-pollo-deshebrado",
			descripcion:
				"Tostadas crujientes de maíz untadas con frijoles refritos, pollo, lechuga crujiente y crema.",
			instrucciones:
				"<p><strong>1. Preparar la base:</strong> Toma las 6 tostadas de maíz y unta una capa uniforme de 1 taza de frijoles refritos sobre cada una.</p>" +
				"<p><strong>2. Agregar la carne:</strong> Coloca encima una porción de 1.5 tazas de pollo deshebrado previamente sazonado.</p>" +
				"<p><strong>3. Añadir complementos:</strong> Agrega lechuga finamente picada por encima del pollo.</p>" +
				"<p><strong>4. Decorar:</strong> Finaliza añadiendo un toque de crema ácida y queso fresco al gusto antes de servir.</p>",
			tiempoPreparacionInt: 20,
			porciones: 3,
			categoria: "Cena",
			ingredientes: [
				{ nombre: "Tostadas de maíz", cantidad: "6 piezas" },
				{ nombre: "Frijoles refritos", cantidad: "1 taza" },
				{ nombre: "Pollo deshebrado", cantidad: "1.5 tazas" },
			],
		},
		{
			titulo: "Crema de Champiñones",
			slug: "crema-de-champinones",
			descripcion:
				"Sopa tersa, suave y cremosa elaborada con champiñones frescos salteados.",
			instrucciones:
				"<p><strong>1. Saltear champiñones:</strong> En una olla con 30 g de mantequilla, sofríe los 300 g de champiñones limpios y rebanados hasta que estén suaves y doren ligeramente. Reserva unos cuantos para decorar.</p>" +
				"<p><strong>2. Licuar:</strong> Pasa la mayor parte de los champiñones a la licuadora junto con las 2 tazas de caldo de pollo y procesa hasta obtener una mezcla fina.</p>" +
				"<p><strong>3. Cremar:</strong> Regresa la mezcla a la olla, añade los 200 ml de crema para batir y revuelve constantemente a fuego bajo.</p>" +
				"<p><strong>4. Calentar:</strong> Sazona con sal y pimienta al gusto. Deja que tome temperatura caliente sin dejar que llegue a hervir fuertemente. Sirve decorando con los champiñones reservados.</p>",
			tiempoPreparacionInt: 25,
			porciones: 3,
			categoria: "Cena",
			ingredientes: [
				{ nombre: "Champiñones frescos", cantidad: "300 g" },
				{ nombre: "Crema para batir", cantidad: "200 ml" },
				{ nombre: "Mantequilla", cantidad: "30 g" },
				{ nombre: "Caldo de pollo", cantidad: "2 tazas" },
			],
		},

		// Postres
		{
			titulo: "Arroz con Leche Cremoso",
			slug: "arroz-con-leche-cremoso",
			descripcion:
				"Postre tradicional dulce cocinado a fuego lento con leche, canela y un toque de vainilla.",
			instrucciones:
				"<p><strong>1. Cocer el arroz base:</strong> En una olla, pon a cocer 1 taza de arroz con 2 tazas de agua y 1 pieza de canela en rama hasta que el agua se evapore y el grano esté suave.</p>" +
				"<p><strong>2. Agregar las leches:</strong> Vierte las 2 tazas de leche entera y 1 lata de leche condensada directamente en la olla con el arroz.</p>" +
				"<p><strong>3. Cocinar a fuego lento:</strong> Remueve constantemente a fuego bajo para evitar que se pegue en el fondo de la olla, permitiendo que la preparación espese y adquiera una consistencia cremosa (aproximadamente 15-20 minutos).</p>" +
				"<p><strong>4. Servir:</strong> Retira la rama de canela, sirve en tazones individuales y espolvorea un poco de canela en polvo por encima.</p>",
			tiempoPreparacionInt: 40,
			porciones: 4,
			categoria: "Postre",
			ingredientes: [
				{ nombre: "Arroz", cantidad: "1 taza" },
				{ nombre: "Leche entera", cantidad: "2 tazas" },
				{ nombre: "Leche condensada", cantidad: "1 lata" },
				{ nombre: "Canela en rama", cantidad: "1 pieza" },
			],
		},
		{
			titulo: "Flan Napolitano Casero",
			slug: "flan-napolitano-casero",
			descripcion:
				"Postre cremoso de huevo horneado a baño maría con una capa de caramelo líquido.",
			instrucciones:
				"<p><strong>1. Hacer el caramelo:</strong> Calienta 1/2 taza de azúcar en un molde para flan a fuego medio hasta que se derrita y adquiera un tono ámbar dorado. Cúbre bien el fondo y paredes del molde, y deja enfriar.</p>" +
				"<p><strong>2. Licuar la mezcla:</strong> En la licuadora, procesa las 5 piezas de huevo, 1 lata de leche condensada y 1 lata de leche evaporada hasta que esté perfectamente integrado.</p>" +
				"<p><strong>3. Hornear a baño maría:</strong> Vierte la mezcla en el molde caramelizado. Tápalo con papel aluminio, colócalo dentro de una charola con agua y hornea a 180 °C durante 50 minutos.</p>" +
				"<p><strong>4. Enfriar y desmoldar:</strong> Saca del horno, deja enfriar a temperatura ambiente y refrigera por al menos 3 horas antes de desmoldar con cuidado.</p>",
			tiempoPreparacionInt: 60,
			porciones: 6,
			categoria: "Postre",
			ingredientes: [
				{ nombre: "Huevos", cantidad: "5 piezas" },
				{ nombre: "Leche condensada", cantidad: "1 lata" },
				{ nombre: "Leche evaporada", cantidad: "1 lata" },
				{ nombre: "Azúcar", cantidad: "1/2 taza" },
			],
		},
		{
			titulo: "Carlota de Limón",
			slug: "carlota-de-limon",
			descripcion:
				"Pastel frío y refrescante estructurado en capas alternadas de galletas María y crema dulce de limón.",
			instrucciones:
				"<p><strong>1. Preparar la crema de limón:</strong> En la licuadora, mezcla 1 lata de leche condensada, 1 lata de leche evaporada y 1/2 taza de jugo de limón fresco hasta que obtengas una mezcla espesa y homogénea.</p>" +
				"<p><strong>2. Hacer la primera capa:</strong> En un refractario rectangular, coloca una base uniforme de galletas María cubriendo todo el fondo.</p>" +
				"<p><strong>3. Alternar capas:</strong> Vierte una capa delgada de la crema de limón sobre las galletas y repite el proceso alternando capas de galleta y crema hasta terminar con los ingredientes.</p>" +
				"<p><strong>4. Refrigerar:</strong> Cubre el refractario y llévalo al refrigerador por un mínimo de 4 horas (lo ideal es dejarlo toda la noche) para que tome consistencia firme y las galletas se suavicen.</p>",
			tiempoPreparacionInt: 20,
			porciones: 6,
			categoria: "Postre",
			ingredientes: [
				{ nombre: "Galletas María", cantidad: "1 paquete" },
				{ nombre: "Leche condensada", cantidad: "1 lata" },
				{ nombre: "Leche evaporada", cantidad: "1 lata" },
				{ nombre: "Jugo de limón", cantidad: "1/2 taza" },
			],
		},
	];

	for (const receta of recetasData) {
		const { ingredientes, ...resto } = receta;
		await prisma.receta.create({
			data: {
				...resto,
				userId: user.id,
				ingredientes: {
					create: ingredientes,
				},
			},
		});
	}

	console.log(
		`Base de datos poblada con éxito. Se crearon ${recetasData.length} recetas y el registro inicial de UserUsage para tu usuario.`,
	);
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
