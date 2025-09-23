
let chartInstance;
document.addEventListener('DOMContentLoaded', function() {
    const graf = document.getElementById("graf");
    if(!graf) return;
    graf.addEventListener("click", function () {
        const titleElement = document.getElementById('chartTitle');
        const canvasElement = document.getElementById('myChart');

        if (!canvasElement.style.display || canvasElement.style.display === "none") {
            const ctx = canvasElement.getContext('2d');
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: [...Array(dailyCounts.length).keys()].map(i => i + 1), // От 1 до N
                    datasets: [
                        {
                            label: 'ОГК',
                            backgroundColor: 'rgba(0, 0, 0, 1)',
                            borderColor: 'rgba(0, 0, 0, 1)',
                            data: dailyCountConstructor,
                            fill: true

                        },
                        {
                            label: 'ОГТ',
                            backgroundColor: 'rgba(0, 0, 255, 1)',
                            borderColor: 'rgba(0, 0, 255, 1)',
                            data: dailyCountTechnologist,
                            fill: true
                        },
                        {
                            label: 'ОТК',
                            backgroundColor: 'rgba(128, 0, 128, 1)',
                            borderColor: 'rgba(128, 0, 128, 1)',
                            data: dailyCountOtk,
                            fill: true
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'right',
                        },
                    },
                },
            });

            canvasElement.style.display = 'block';
            titleElement.style.display = 'block';
            this.textContent = 'Скрыть график';
        } else {
            chartInstance.destroy();
            canvasElement.style.display = 'none';
            titleElement.style.display = 'none';
            this.textContent = 'Показать график';
        }
    });
});