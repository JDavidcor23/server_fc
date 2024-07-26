const puppeteer = require("puppeteer");
const addProperties = require("./propertiesUser");
require("dotenv").config();

async function getInputValueAndName(numbersProperties) {
  const browser = await puppeteer.launch({
    args: ["--disable-setuid-sandbox", "--no-sandbox"],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });

  try {
    console.log("empieza el proceso");
    if (numbersProperties.length !== 29) {
      throw new Error(
        `The array must have 29 elements === ${numbersProperties.length}`
      );
    }
    const propertiesUser = addProperties(numbersProperties);
    console.log("se añadieron las propiedades del usuario");
    console.log("se abre el navegador");

    const page = await browser.newPage();

    // Cambiar el user agent
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Probar con otra URL primero para verificar conectividad
    await page.goto("https://www.google.com", {
      timeout: 60000, // 1 minuto de espera
      waitUntil: "networkidle2",
    });
    console.log("Google cargado correctamente");

    await page.goto("https://sofifa.com/calculator?hl=en-US", {
      timeout: 120000, // Incrementar el tiempo de espera a 2 minutos
      waitUntil: "networkidle2",
    });
    console.log("se abrió la página de Sofifa");

    // Verificar el título de la página
    const pageTitle = await page.title();
    console.log(`Título de la página: ${pageTitle}`);

    // Esperar explícitamente a que los inputs estén presentes
    await page.waitForSelector(".calc", { timeout: 90000 });
    console.log("Inputs encontrados");

    const properties = await page.$$eval(".calc", (inputs) => {
      return inputs.map((input) => input.getAttribute("name"));
    });

    for (const property in propertiesUser) {
      const inputName = property;
      const inputValue = propertiesUser[property];
      if (properties.includes(inputName)) {
        console.log(
          `Escribiendo en input: ${inputName} con valor: ${inputValue}`
        );
        await page.type(`input[name="${inputName}"]`, inputValue.toString());
        await delay(100); // Añadir un pequeño retraso
      }
    }

    await page.keyboard.press("Enter");

    // Esperar explícitamente a que las posiciones estén presentes
    await page.waitForSelector(".lineup .pos", { timeout: 90000 });
    console.log("Las posiciones han sido encontradas.");

    const positions = await page.$$eval(".lineup .pos", (positions) => {
      return positions.map((position) => {
        const positionText = position.innerText.split("\n")[0].trim();
        const numberText = position.querySelector("em").innerText.trim();
        const number = parseInt(numberText, 10);
        return { position: positionText, number };
      });
    });
    console.log("Las posiciones han sido extraídas.");

    const sortedPositions = positions.sort((a, b) => b.number - a.number);

    const uniquePositions = new Set();
    const top5Positions = [];

    for (const pos of sortedPositions) {
      if (uniquePositions.size >= 5) break;
      if (!uniquePositions.has(pos.position)) {
        uniquePositions.add(pos.position);
        top5Positions.push(pos);
      }
    }

    const positionsArray = [];
    top5Positions.forEach(({ position, number }) => {
      console.log(`Posición: ${position} Número: ${number}`);
      positionsArray.push(`Posición: ${position} Número: ${number}`);
    });

    return positionsArray;
  } catch (error) {
    console.error("Error durante la ejecución:", error);
    throw error;
  } finally {
    await browser.close();
    console.log("Navegador cerrado");
  }
}

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

module.exports = getInputValueAndName;
