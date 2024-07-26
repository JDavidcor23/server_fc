const puppeteer = require("puppeteer");
const addProperties = require("./propertiesUser");
require("dotenv").config();

async function getInputValueAndName(numbersProperties) {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      // "--single-process",
      // "--no-zygote",
    ],
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

    await page.goto("https://sofifa.com/calculator?hl=en-US", {
      timeout: 90000,
      waitUntil: "networkidle2",
    }).then(() => console.log("se abrió la página"));

    // Alerta de que la página ha cargado
    console.log("La página ha cargado correctamente.");
    
    
    // Esperar explícitamente a que los inputs estén presentes
    await page.waitForSelector(".calc", { timeout: 90000 });

    const properties = await page.$$eval(".calc", (inputs) => {
      return inputs.map((input) => input.getAttribute("name"));
    });

    for (const property in propertiesUser) {
      const inputName = property;
      const inputValue = propertiesUser[property];
      if (properties.includes(inputName)) {
        await page.type(`input[name="${inputName}"]`, inputValue.toString());
      }
    }

    await page.keyboard.press("Enter");

    // Esperar explícitamente a que las posiciones estén presentes
    await page.waitForSelector(".lineup .pos");
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
    throw error;
  }finally {
    await browser.close();
  }
}

module.exports = getInputValueAndName;
