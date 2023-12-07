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
function createHexagon(center, size, rotationAngle) {
  const points = [];
  const angleOff = Math.PI / 6 + rotationAngle;  // Смещение угла для коррекции и поворота
  for (let i = 0; i < 6; i++) {
    const angle = angleOff + (2 * Math.PI / 6) * i;
    const x = center[0] + size * Math.cos(angle);
    const y = center[1] + (size / Math.cos(angleOff)) * Math.sin(angle);  // Коррекция для широты
    points.push([x, y]);
  }
  return points;
}

function showMenu(hexagon) {
  // Здесь можно добавить код для отображения менюшки
  alert('text');
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

// Инициализация карты
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

  // Количество строк и столбцов в сетке
  const rows = 60;
  const cols = 30;

  // Создать объект для хранения суммы текстов для каждого гексагона

  let SumPrice = 0;
  let id_ = 0;
  let hexagonCenterTemp = '0';

  for (let g = 0; g < latitude.length; g++) {
    const targetCoordinates = [latitude[g], longitude[g]];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let hexagonCenterY = 60.481880 + j * hexagonSize * Math.sqrt(12);
        if (i % 2 === 1) {
          hexagonCenterY += hexagonSize * Math.sqrt(12) / 2;
        }
        const hexagonCenter = [
          56.777419 + i * hexagonSize * 1.5,
          hexagonCenterY
        ];
        const hexagonPoints = createHexagon(hexagonCenter, hexagonSize, rotationAngle);

        if (isPointInsideHexagon(targetCoordinates, hexagonPoints)) {
          const fillColor = 'rgba(255, 0, 0, 1.0)';


          const Price =  price[g] * square[g];
          const hexagonCenterMain = hexagonCenter.toString();

          const centerOfHexagon = DG.polygon(hexagonPoints).getBounds().getCenter();
          const textElement = DG.marker(centerOfHexagon, {
            icon: DG.divIcon({
              html: `<div>${SumPrice}</div>`, // Использовать сумму текстов для данного гексагона
              iconSize: [100, 40],
              className: 'hexagon-text',
            }),
          });

          if(hexagonCenterMain == hexagonCenterTemp){
             SumPrice += Price;
             id_ += 1;
          }
          else{
              textElement.addTo(map);
              SumPrice = Price;
              id_ = 0;
          }

          hexagonCenterTemp = hexagonCenter.toString();





          const hexagon = DG.polygon(hexagonPoints, {
            fillColor: fillColor,
            weight: 1,
            color: 'black',
          })
          .on('mouseover', function () {
            hexagon.setStyle({ fillColor: 'rgba(0, 0, 0, 1.0)' });
          })
          .on('mouseout', function () {
            hexagon.setStyle({ fillColor: fillColor });
          });
          hexagon.addTo(map);
          hexagon.options.className = 'hexagon-button';
        }
      }
    }
  }
});
