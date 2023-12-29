<!DOCTYPE html>
<html lang="en">
<head>

  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ГИС-Аналитика</title>
  <script src="https://maps.api.2gis.ru/2.0/loader.js?pkg=full"></script>
  <style>
  .text-marker {
    font-size: 20px;
    color: black;
    text-align: center;
  }
</style>
</head>
<body>
  <div id="map" style="width: 100%; height: 1000px;"></div>
  <script src="https://mapgl.2gis.com/api/js/v1"></script>
<script>
const apiKey = '0fc48f85-117d-4d93-84de-e20fa09d921a';

var latitude = [
  {% for item in adresses %}
    '{{ item.latitude }}',
  {% endfor %}
]
var longitude = [
  {% for item in adresses %}
    '{{ item.longitude }}',
  {% endfor %}
]
var price = [
  {% for item in adresses %}
    '{{ item.price }}',
  {% endfor %}
]
var square = [
  {% for item in adresses %}
    '{{ item.square }}',
  {% endfor %}
]

// Функция для создания гексагона с углом поворота
function createHexagon(center, size, rotationAngle, id) {
  const points = [];
  const angleOff = Math.PI / 6 + rotationAngle;  // Смещение угла для коррекции и поворота
  for (let i = 0; i < 6; i++) {
    const angle = angleOff + (2 * Math.PI / 6) * i;
    const x = center[0] + size * Math.cos(angle);
    const y = center[1] + (size / Math.cos(angleOff)) * Math.sin(angle);  // Коррекция для широты
    points.push([x, y]);
  }
  return { points, id };
}

function showMenu(hexagon, price) {
  // Create and display the menu
  const menu = `<div class="menu" style="position: absolute;width: 20%; height: 1000px; right: 2px; top: 2px;  background-color: white;">Цена: ${price}</div>`;
  document.body.insertAdjacentHTML('beforeend', menu);
}

function isPointInsideHexagon(point, hexagonPoints) {
  let inside = false;
  const x = point[0];
  const y = point[1];

  for (let i = 0, j = hexagonPoints.length - 1; i < hexagonPoints.length; j = i++) {
    const xi = hexagonPoints[i][0];
    const yi = hexagonPoints[i][1];
    const xj = hexagonPoints[j][0];
    const yj = hexagonPoints[j][1];

    const intersect =
      ((yi > y) !== (yj > y)) &&
      (x < ((xj - xi) * (y - yi)) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

function shortenNumber(number) {
    if (number >= 1000000000) {
        return (number / 1000000000).toFixed(1) + ' млрд';
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + ' млн';
    } else {
        return number.toString();
    }
}

// Инициализация карты
DG.then(function () {
  const map = DG.map('map', {
    center: [56.83855, 60.605028], // Координаты центра карты
    zoom: 13 // Уровень масштабирования
  });

  // Размер гексагона (в градусах)
  const hexagonSize = 0.002;

  // Угол поворота гексагона (в радианах)
  const rotationAngle = Math.PI / 2;  // 90 градусов

  // Создать объект для хранения данных о гексагонах
  const hexagonsData = [];

  // Создание гексагонов на карте
  for (let g = 0; g < latitude.length; g++) {
    const hexagonCenter = [parseFloat(latitude[g]), parseFloat(longitude[g])]; // Центр гексагона

    const hexagonData = createHexagon(hexagonCenter, hexagonSize, rotationAngle, g); // передаем id гексагона
    hexagonsData.push(hexagonData);

    const fillColor = 'blue'; // TODO: Определить цвет в зависимости от данных

    const hexagon = DG.polygon(hexagonData.points, {
      fillColor: fillColor,
      weight: 1,
      color: 'black',
    })
    .on('click', function () {
      const priceText = shortenNumber(price[hexagonData.id] * square[hexagonData.id]); // получаем текст цены
      showMenu(this, priceText); // отображаем меню с соответствующим текстом
    })
    ;

    hexagon.addTo(map);
  }
});
</script>
</body>
</html>