document.addEventListener('DOMContentLoaded', () => {
            const targets = document.querySelectorAll('.target');

            let draggedElement = null;
            let offset = [0, 0];
            let initialPositions = {};
            let stuckElement = null;
            let lastClickTime = 0;
            let lastClickedElement = null;

            targets.forEach(target => {
                const rect = target.getBoundingClientRect();
                initialPositions[target.id || Math.random()] = {
                    x: rect.left,
                    y: rect.top
                };
            });

            function handleDragStart(e) {
                draggedElement = e.target;

                const rect = draggedElement.getBoundingClientRect();
                offset = [
                    e.clientX - rect.left,
                    e.clientY - rect.top
                ];

                draggedElement.classList.add('dragging');
                document.addEventListener('mousemove', handleDrag);
                document.addEventListener('mouseup', handleDragEnd);
            }

            function handleDrag(e) {
                if (!draggedElement) return;

                e.preventDefault();

                draggedElement.style.left = `${e.clientX - offset[0]}px`;
                draggedElement.style.top = `${e.clientY - offset[1]}px`;
            }

            function handleDragEnd() {
                if (!draggedElement) return;

                draggedElement.classList.remove('dragging');
                draggedElement = null;
                document.removeEventListener('mousemove', handleDrag);
                document.removeEventListener('mouseup', handleDragEnd);
            }

            function handleClick(e) {
                const currentTime = Date.now();
                const element = e.target;

                if (currentTime - lastClickTime < 300 && element === lastClickedElement) {
                    e.stopPropagation();
                    if (element.style.backgroundColor === 'blue') {
                        unstuckElement(element);
                    } else {
                        element.style.backgroundColor = 'blue';
                        element.style.transition = 'background-color 0.3s ease';
                        stickElement(element);
                    }
                    return;
                }

                lastClickTime = currentTime;
                lastClickedElement = element;
            }

            function stickElement(element) {
                if (stuckElement) {
                    unstuckElement(stuckElement);
                }

                stuckElement = element;
                element.classList.add('stuck');

                document.addEventListener('mousemove', updateStuckPosition);
                document.addEventListener('click', unstickOnAnyClick);
            }

            function unstuckElement(element) {
                if (!element || !element.classList.contains('stuck')) return;

                const id = element.id || Math.random();
                const initialPos = initialPositions[id];

                if (initialPos) {
                    element.style.left = `${initialPos.x}px`;
                    element.style.top = `${initialPos.y}px`;
                }

                element.style.backgroundColor = 'red';
                element.style.transition = 'background-color 0.3s ease';

                stuckElement = null;

                document.removeEventListener('mousemove', updateStuckPosition);
                document.removeEventListener('click', unstickOnAnyClick);
            }

            function updateStuckPosition(e) {
                if (!stuckElement) return;

                stuckElement.style.left = `${e.clientX - offset[0]}px`;
                stuckElement.style.top = `${e.clientY - offset[1]}px`;
            }

            function unstickOnAnyClick(e) {
                if (stuckElement) {
                    unstuckElement(stuckElement);
                }
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && stuckElement) {
                    unstuckElement(stuckElement);
                }
            });

            targets.forEach(target => {
                target.addEventListener('mousedown', handleDragStart);
                target.addEventListener('click', handleClick);
            });

            targets.forEach(target => {
                target.addEventListener('touchstart', handleTouchStart);
                target.addEventListener('touchend', handleTouchEnd);
                target.addEventListener('touchmove', handleTouchMove);
            });