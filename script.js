const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin-button');

// Các phần tử trên vòng quay với tỉ lệ xuất hiện khác nhau
const segments = [
    { label: '1 lượt bốc quà', weight: 0.3 },  
    { label: '500.000 VND', weight: 0 },
    { label: '1 lượt bốc quà', weight: 0.3 }, 
    { label: '50.000', weight: 0 },
    { label: 'Một tràng pháo tay', weight: 0.1 }, 
    { label: 'Một vé gửi xe miễn phí', weight: 0.1 },
    { label: 'Hát một bài', weight: 0.2 },
    { label: 'chỉ định 1 người hát', weight: 0.1 },
    { label: '5000 VND', weight: 0.1 },
    { label: '1 Người yêu', weight: 0 }
];

const totalSegments = segments.length;
const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A1FF33', '#33A1FF', '#FFA133', '#FF3333', '#33FFA1', '#A133FF'];

let currentAngle = 0;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

// Hàm vẽ vòng quay với các phần bằng nhau
function drawWheel() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY);
    const arcSize = (2 * Math.PI) / totalSegments;

    // Vẽ các phần tử của vòng quay
    segments.forEach((segment, index) => {
        const startAngle = arcSize * index;
        const endAngle = startAngle + arcSize;

        // Vẽ phần của vòng quay
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.lineTo(centerX, centerY);
        ctx.fillStyle = colors[index % colors.length];
        ctx.fill();

        // Vẽ nhãn tên giải thưởng
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = '18px Arial';
        ctx.fillText(segment.label, radius - 10, 10);
        ctx.restore();
    });
}

// Hàm quay vòng
function spinWheel() {
    spinAngleStart = Math.random() * 10 + 20; // Quay ngẫu nhiên từ 20 đến 30 vòng
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000; // Quay trong khoảng 4-7 giây
    rotateWheel();
}

// Hàm xoay vòng quay và giảm tốc độ
function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }

    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    currentAngle += (spinAngle * Math.PI) / 180;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(currentAngle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawWheel();
    ctx.restore();

    requestAnimationFrame(rotateWheel);
}

// Hàm giảm dần tốc độ quay
function easeOut(t, b, c, d) {
    return c * (1 - Math.pow(1 - t / d, 3)) + b;
}

// Hàm dừng quay và hiển thị kết quả
function stopRotateWheel() {
    const segmentAngle = (2 * Math.PI) / totalSegments;
    const normalizedAngle = (currentAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI); // Đảm bảo giá trị trong khoảng từ 0 đến 2π
    const winningIndex = Math.floor((2 * Math.PI - normalizedAngle) / segmentAngle) % totalSegments;

    // Xác suất trúng từng giải (dựa trên trọng số)
    const totalWeight = segments.reduce((sum, segment) => sum + segment.weight, 0);
    const randomWeight = Math.random() * totalWeight;

    let cumulativeWeight = 0;
    let winningSegment = segments[0]; // Phần mặc định
    for (const segment of segments) {
        cumulativeWeight += segment.weight;
        if (randomWeight <= cumulativeWeight) {
            winningSegment = segment;
            break;
        }
    }

    alert(`Bạn đã trúng: ${winningSegment.label}`);
    const finalAngle = winningIndex * segmentAngle;
    currentAngle = 2 * Math.PI - finalAngle;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(currentAngle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawWheel();
    ctx.restore();
}

// Thêm sự kiện cho nút quay
spinButton.addEventListener('click', () => {
    spinWheel();
});

// Vẽ vòng quay ngay khi tải trang
drawWheel();
