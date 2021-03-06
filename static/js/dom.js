// It uses data_handler.js to visualize elements
import {dataHandler} from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        dom.initCreateNewBoardButton();

        dom.loadBoards()

    },

    // BOARD FUNCTIONS

    initCreateNewBoardButton: function () {
        let boardContainer = document.getElementById("boards")
        boardContainer.innerHTML = null
        const createNewBoardButton = document.createElement("button");
        createNewBoardButton.appendChild(document.createTextNode("Create New Board"));
        createNewBoardButton.setAttribute("id", "new-board");
        let body = document.querySelector("body");
        body.insertBefore(createNewBoardButton, boardContainer);
        let newBoard = document.getElementById("new-board")
        newBoard.addEventListener("click", dom.createNewBoard);
    },

    loadBoards: function () {
        // retrieves boards and makes showBoards called
         dataHandler.getBoards(function (boards) {
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {
        let boardList = '';

        for (let board of boards) {
            let userSpan;
            board.user ? userSpan = `<span class="board-user">${board.user}</span>` : userSpan = '';
            boardList += `
        <section class="board" id="section-board-${board.id}">
            <div class="board-header" id="boardheader-${board.id}">
                <span class="board-title" id="boardtitle-${board.id}">${board.title}</span>
                ${userSpan}
                <button class="board-delete" id="delete-board-${board.id}"><i class="fa fa-trash"></i></button>
                <button class="board-add" id="boardaddcolumn-${board.id}">Add Status</button>
                <button class="board-add" id="boardaddcard-${board.id}">Add Card</button>
                <button class="board-toggle" id="board-${board.id}"><i class="fas fa-chevron-down"></i></button>
            </div>
            <div class="board-columns" id="column-${board.id}"></div>
        
        </section>
            `;
        }

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.innerHTML = boardList;

        let deleteBoardButtons = document.getElementsByClassName("board-delete");
        for (let deleteBtn of deleteBoardButtons) {
            deleteBtn.addEventListener('click', dom.initDeleteBoard);
        }

        let closeBoardButtons = document.getElementsByClassName('board-toggle')
        for (let closeBtn of closeBoardButtons) {
            closeBtn.addEventListener('click', dom.initCloseTable);
        }

        for (let board of boards) {
            dom.loadStatuses(board.id);

            let boardTitle = document.getElementById(`boardtitle-${board.id}`);
            boardTitle.addEventListener('click', dom.renameBoard);

            let addCardButton = document.getElementById(`boardaddcard-${board.id}`);
            addCardButton.addEventListener('click', dom.createCard);

            let addColumnButton = document.getElementById(`boardaddcolumn-${board.id}`)
            addColumnButton.addEventListener('click', dom.createColumn)
        }


    },
    initDeleteBoard: function (event) {
        event.preventDefault();
        const idIndex = 2;
        let boardId = event.currentTarget.id.split('-')[idIndex];
        if (confirm(`Are you sure you want to delete this board?`)) {
            dataHandler.deleteBoard(boardId, (response) => {
                dom.showServerMessage(response);
                console.log(response);
                dom.loadBoards();
            })
        } else {
            dom.showServerMessage('Board is not deleted')
            console.log('Board is not deleted')
        }
    },

    createNewBoard: function (event) {
        let createBoard = event.currentTarget;
        let input = document.createElement('input');
        createBoard.parentElement.replaceChild(input, createBoard);
        input.type = 'text';
        input.placeholder = "New Board";
        input.required;
        input.addEventListener("keydown", (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                let newBoardTitle = input.value;
                if (newBoardTitle.length === 0) {
                    alert('You have to add a title')
                    dom.init();
                } else {
                    dataHandler.createNewBoard(newBoardTitle, (response) => {
                        input.remove();
                        dom.init();
                        dom.showServerMessage(response)
                    });
                }
            }
        })

    },

    renameBoard: function (event) {
        let boardTitle = event.currentTarget
        boardTitle.addEventListener("click", function (e) {
            e.target.contentEditable = true;
            boardTitle.addEventListener("keydown", (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault()
                    let renamedBoard = boardTitle.textContent
                    event.target.contentEditable = false;
                    let boardId = event.target.dataset.id
                    let data = {"title": renamedBoard.trim()};
                    if (data.title.length === 0) {
                            data.title = 'UNTITLED'
                    }
                    dataHandler.renameBoard(boardId, data, (response) => {
                        dom.showServerMessage(response);
                        dom.loadBoards();
                        console.log(response);
                    })

                }
            })
        })


    },

    //STATUS FUNCTIONS

    loadStatuses: function (board_id) {
        dataHandler.getStatuses(board_id, function (statuses) {
            dom.showStatuses(statuses, board_id);
            dom.renameStatus();
        });


    },
    showStatuses: function (statuses, board_id) {
        let column = ''
        for (let status of statuses) {
            column += `
                <div class="board-column">
                    <button class="column-delete" id="delete-column-${status.id}"><i class="fa fa-trash"></i></button>
                    <div class="board-column-title" data-id="${status.id}">
                        ${status.title}
                    </div>
                    <div class="board-column-content" id="cardholder-${status.id}"></div>
                    
                    </div>
                `
        }
        let statusContainer = document.getElementById('column-' + board_id);
        statusContainer.innerHTML = column;

        let deleteColumnButtons = document.getElementsByClassName("column-delete");
        for (let deleteBtn of deleteColumnButtons) {
            deleteBtn.addEventListener('click', dom.initDeleteColumn);
        }

        for (let status of statuses) {
            dom.loadCards(status.id)
        }

    },
    renameStatus: function () {
        let boardColumnTitles = document.getElementsByClassName("board-column-title")
        for (let title of boardColumnTitles) {
            title.addEventListener("click", function (e) {
                e.target.contentEditable = true;
                title.addEventListener("keydown", (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault()
                        let renamedStatus = title.textContent
                        event.target.contentEditable = false;
                        let statusId = event.target.dataset.id
                        let data = {"title": renamedStatus.trim()};
                        if (data.title.length === 0) {
                            data.title = 'UNTITLED'
                        }
                        dataHandler.renameStatus(statusId, data, (response) => {
                            dom.loadBoards();
                            dom.showServerMessage(response);
                            console.log(response)
                        })
                    }
                })
            })
        }
    },

    // CARD FUNCTIONS

    initDeleteColumn: function (event) {
        event.preventDefault();
        const idIndex = 2;
        let columnId = event.currentTarget.id.split('-')[idIndex];
        if (confirm(`Are you sure you want to delete this column?`)) {
            dataHandler.deleteColumn(columnId, (response) => {
                dom.showServerMessage(response);
                console.log(response);
                dom.loadBoards();
            })
        } else {
            dom.showServerMessage('Column is not deleted')
            console.log('Column is not deleted')
        }
    },

    // CARD FUNCTIONS

    loadCards: function (column_id) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(column_id, function (cards) {
            dom.showCards(cards, column_id);
            dom.renameCards();
            dom.initDragAndDrop();
        });
    },
    showCards: function (cards, column_id) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let showCard = ""
        for (let card of cards) {
            showCard += `
                        <div class="card" id="card-${card.id}" draggable="true">
                            <div class="card-remove" id="delete-card-${card.id}"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title" data-id="${card.id}">${card.title}</div>
                        </div>            `
        }
        let cardContainer = document.getElementById("cardholder-" + column_id)
        cardContainer.innerHTML = showCard;
        let deleteCardButtons = document.getElementsByClassName("card-remove");
        for (let deleteBtn of deleteCardButtons) {
            deleteBtn.addEventListener('click', dom.initDeleteCard);
        }

    },
    renameCards: function () {
        let cardTitles = document.getElementsByClassName("card-title");
        for (let cardTitle of cardTitles) {
            cardTitle.addEventListener("click", function (e) {
                e.target.contentEditable = true;
                cardTitle.addEventListener("keydown", (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault()
                        let renamedCard = cardTitle.textContent
                        event.target.contentEditable = false;
                        let cardId = event.target.dataset.id
                        let data = {"title": renamedCard.trim()};
                        if (data.title.length === 0) {
                            data.title = 'UNTILED'
                        }
                        dataHandler.renameCards(cardId, data, (response) => {
                            dom.showServerMessage(response);
                            dom.loadBoards();
                            console.log(response)
                        })
                    }
                })
            })
        }
    },
    initDeleteCard: function (event) {
        event.preventDefault();
        const idIndex = 2;
        let cardId = event.currentTarget.id.split('-')[idIndex];
        if (confirm(`Are you sure you want to delete this card?`)) {
            dataHandler.deleteCard(cardId, (response) => {
                dom.showServerMessage(response);
                console.log(response);
                dom.loadBoards();
            })
        } else {
            dom.showServerMessage('Card is not deleted');
            console.log('Card is not deleted')
        }
    },

    initDragAndDrop: function () {
        const draggableCards = document.querySelectorAll('.card');
        const cardContainers = document.querySelectorAll('.board-column-content');
        console.log(draggableCards)

        draggableCards.forEach(draggableCard => {
            draggableCard.addEventListener('dragstart', () => {
                draggableCard.classList.add('dragging')
            })

            draggableCard.addEventListener('dragend', () => {
                draggableCard.classList.remove('dragging')
            })
        })

        cardContainers.forEach(column => {
            column.addEventListener('dragover', (event) => {
                event.preventDefault();
                const afterElement = getDragAfterElement(column, event.clientY);
                console.log(afterElement)
                const draggedCard = document.querySelector('.dragging');

                if (afterElement == null) {
                    column.appendChild(draggedCard);
                } else {
                    column.insertBefore(draggedCard, afterElement)
                }
            })

            column.addEventListener('drop', (event) => {
                const draggedCard = document.querySelector('.dragging');

                const idIndex = 1;
                const draggedCardId = draggedCard.id.split('-')[idIndex]
                const columnId = column.id.split('-')[idIndex]
                const boardId = column.parentElement.parentElement.id.split('-')[idIndex]
                const columnCards = column.children
                let cardsId = []
                let orders = []
                for (let [key, values] of Object.entries(columnCards)) {
                    orders.push(parseInt(key))
                    cardsId.push(parseInt(values.id.split('-')[idIndex]))
                }

                dataHandler.changeCardStatus(draggedCardId, boardId, columnId, orders, cardsId, (response) => {
                    dom.showServerMessage(response)
                    console.log(response)
                })
            })
        })

        function getDragAfterElement(container, y) {
            const draggableCards = [...container.querySelectorAll('.card:not(.dragging)')]

            return draggableCards.reduce((closestElement, containerChild) => {
                const card = containerChild.getBoundingClientRect();
                const offset = y - card.top - card.height / 2;
                if (offset < 0 && offset > closestElement.offset) {
                    return {offset: offset, element: containerChild}
                } else {
                    return closestElement
                }
            }, {offset: Number.NEGATIVE_INFINITY}).element
        }

    },
    createColumn: function (event) {
        const idIndex = 1
        let createColumn = event.currentTarget;
        let boardId = createColumn.id.split('-')[idIndex]
        let input = document.createElement('input');
        createColumn.parentElement.replaceChild(input, createColumn);
        input.type = 'text';
        input.placeholder = "New Status";
        input.required;
        input.addEventListener("keydown", (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                let newColumnTitle = input.value;
                if (newColumnTitle.length === 0) {
                    alert('You have to add a title')
                    dom.loadBoards();
                } else {
                    dataHandler.createNewColumn(boardId, newColumnTitle, (response) => {
                        dom.loadBoards();
                        dom.showServerMessage(response);
                    })
                }
            }
        })
    },

    createCard: function (event) {
        const idIndex = 1
        let createCard = event.currentTarget;
        let boardId = createCard.id.split('-')[idIndex]
        let input = document.createElement('input');
        createCard.parentElement.replaceChild(input, createCard);
        input.type = 'text';
        input.placeholder = "New Card";
        input.required;
        input.addEventListener("keydown", (ev) => {
            if (ev.key === 'Enter') {
                ev.preventDefault();
                let newCardTitle = input.value;
                if (newCardTitle.length === 0) {
                    alert('You have to add a title')
                } else {
                    dataHandler.createNewCard(boardId, newCardTitle, (response) => {
                        dom.loadBoards();
                        dom.showServerMessage(response);
                    })
                }
            }
        })
    },

    initCloseTable: function (event) {
        const idIndex = 1;
        const boardId = event.currentTarget.id.split('-')[idIndex];
        let table = document.querySelector(`#column-${boardId}`);
        if (table.className === 'board-columns') {
            table.classList.add('hidden');
        } else {
            table.classList.remove('hidden');
        }
    },
    showServerMessage: function (response) {
        let messageContainer = document.querySelector('.message-container');
        messageContainer.textContent = response;
        setTimeout(() => {
            messageContainer.textContent = null;
        }, 2000)
    },

    // here comes more features
};
