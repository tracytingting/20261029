// 設定兩種角色精靈表各自的載入路徑。
const idleSpritePath = '1/waik/waik/waik0010.png';
const jumpSpritePath = '1/jump/jump/jimp.png';

// 設定每張精靈表都包含九個水平排列的動畫影格。
const frameCountTotal = 9;

// 設定角色的放大倍率與每次移動的速度。
const spriteScale = 4;
const moveSpeed = 4;

// 宣告待機與跳躍用的圖片變數。
let idleSprite;
let jumpSprite;

// 宣告角色中心座標與面向方向，正數代表朝右。
let playerX;
let playerY;
let facingDirection = 1;

// 在畫布建立前載入角色精靈圖片。
function preload() {
	// 載入角色待機動畫精靈表。
	idleSprite = loadImage(idleSpritePath);

	// 載入角色跳躍動畫精靈表。
	jumpSprite = loadImage(jumpSpritePath);
}

// 建立符合瀏覽器視窗大小的全螢幕畫布。
function setup() {
	// 依照目前視窗寬高建立畫布。
	createCanvas(windowWidth, windowHeight);

	// 關閉圖片平滑處理，保留像素圖的清晰邊緣。
	noSmooth();

	// 將角色初始位置設定在畫面中央。
	playerX = width / 2;
	playerY = height / 2;
}

// 每一影格更新背景、角色位置與動畫畫面。
function draw() {
	// 使用指定的淡綠色清除上一影格。
	background('#cbdfbd');

	// 預設使用待機精靈表，且角色保持原本的面向。
	let activeSprite = idleSprite;
	let direction = 0;

	// 按住右方向鍵時切換跳躍動畫並設定向右移動。
	if (keyIsDown(RIGHT_ARROW)) {
		direction = 1;
		facingDirection = 1;
	// 按住左方向鍵時切換跳躍動畫並設定向左移動。
	} else if (keyIsDown(LEFT_ARROW)) {
		direction = -1;
		facingDirection = -1;
	}

	// 只有按住左右方向鍵時才播放跳躍動畫。
	if (direction !== 0) {
		activeSprite = jumpSprite;
	}

	// 依照目前選用的精靈表，計算每個影格的原始寬高。
	const sourceFrameWidth = activeSprite.width / frameCountTotal;
	const sourceFrameHeight = activeSprite.height;

	// 按照統一倍率計算角色顯示尺寸。
	const displayWidth = sourceFrameWidth * spriteScale;
	const displayHeight = sourceFrameHeight * spriteScale;

	// 依照方向更新角色水平位置，並限制角色留在畫布範圍內。
	playerX = constrain(
		playerX + direction * moveSpeed,
		displayWidth / 2,
		width - displayWidth / 2
	);

	// 依照影格計數循環播放九個動畫影格。
	const frameIndex = floor(frameCount / 8) % frameCountTotal;

	// 依照影格索引計算精靈表中的來源位置。
	const sourceX = frameIndex * sourceFrameWidth;

	// 移動畫布原點，讓角色以自身中心座標繪製。
	push();
	translate(playerX, playerY);

	// 角色朝左時水平翻轉圖片，完成轉向效果。
	if (facingDirection === -1) {
		scale(-1, 1);
	}

	// 從精靈表裁切目前影格並繪製到角色所在位置。
	image(
		activeSprite,
		-displayWidth / 2,
		-displayHeight / 2,
		displayWidth,
		displayHeight,
		sourceX,
		0,
		sourceFrameWidth,
		sourceFrameHeight
	);

	// 還原畫布座標，避免影響下一次繪圖。
	pop();
}

// 視窗尺寸改變時同步調整畫布大小。
function windowResized() {
	// 將畫布重新調整為目前視窗的寬高。
	resizeCanvas(windowWidth, windowHeight);

	// 重新限制角色位置，避免角色超出縮小後的畫布。
	playerX = constrain(playerX, 0, width);
	playerY = constrain(playerY, 0, height);
}

// 阻止方向鍵觸發瀏覽器預設的捲動畫面行為。
function keyPressed() {
	// 按下左右方向鍵時取消瀏覽器預設操作。
	if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
		return false;
	}
}

// 放開方向鍵時同樣阻止瀏覽器預設操作。
function keyReleased() {
	// 放開左右方向鍵時取消瀏覽器預設操作。
	if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
		return false;
	}
}
