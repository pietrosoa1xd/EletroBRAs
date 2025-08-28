 const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    function triggerTetoMeme() {
        const numberOfMemes = 100;
        
        for (let i = 0; i < numberOfMemes; i++) {
            const tetoMeme = document.createElement('img');
            tetoMeme.src = 'img/pearto.webp'; // Caminho atualizado para o arquivo .webp
            tetoMeme.className = 'kasane-teto-meme';
            
            tetoMeme.style.left = `${Math.random() * 100}vw`;
            tetoMeme.style.animationDelay = `${Math.random() * 2}s`;
            
            document.body.appendChild(tetoMeme);

            tetoMeme.addEventListener('animationend', () => {
                tetoMeme.remove();
            });
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                triggerTetoMeme();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });