// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
    },
    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {

        // shows boards appending them to #boards div
        // it adds necessary event listeners also
        let boardContainer = document.getElementById("boards")
        boardContainer.innerHTML = null
        const createNewBoardButton = document.createElement("button");
        createNewBoardButton.appendChild(document.createTextNode("Create New Board"));
        createNewBoardButton.setAttribute("id", "new-board");
        let body = document.querySelector("body");
        body.insertBefore(createNewBoardButton, boardContainer);
        let newBoard = document.getElementById("new-board")
        newBoard.addEventListener("click", this.createNewBoard );


        let boardList = '';

        for(let board of boards){
            boardList += `
        <section class="board" id="section-board-${board.id}">
            <div class="board-header" id="board-${board.id}"><span class="board-title" id="board-${board.id}">${board.title}</span>
                <button class="board-add" id="board-${board.id}">Add Card</button>
                <button class="board-toggle" id="board-${board.id}"><i class="fas fa-chevron-down"></i></button>
                <button class="board-delete" id="delete-board-${board.id}"><i class="fa fa-trash"></i></button>
             
                
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
        for(let board of boards) {
            this.loadStatuses(board.id)
        }

    },
    initDeleteBoard: function (event) {
        event.preventDefault();
        const idIndex = 2;
        let boardId = event.currentTarget.id.split('-')[idIndex];
        if (confirm(`Are you sure you want to delete this board?`)) {
            dataHandler.deleteBoard(boardId, (response) => {
                console.log(response);
            })
        } else {
            console.log('Board is not deleted')
        }
    },

    createNewBoard: function () {
        const newBoardTitle = "New Board";
        dataHandler.createNewBoard(newBoardTitle);
        dom.loadBoards()
    },
    loadStatuses: function (board_id) {
        dataHandler.getStatuses(board_id, function (statuses) {
            dom.showStatuses(statuses, board_id)
        });


    },
    showStatuses: function (statuses, board_id) {
        let column = ''
        for (let status of statuses) {
            column += `
                <div class="board-column">
                    <div class="board-column-title">${status.title}</div>
                    <div class="board-column-content" id="cardholder-${status.id}"></div>
                    </div>
                `
        }
            let stasusContainer = document.getElementById('column-' + board_id);
            stasusContainer.innerHTML = column;
        for(let status of statuses) {
            this.loadCards(status.id)
        }

    },

    loadCards: function (column_id) {
        // retrieves cards and makes showCards called
        dataHandler.getCardsByBoardId(column_id, function (cards){
        dom.showCards(cards, column_id)
        });
    },
    showCards: function (cards, column_id) {
        // shows the cards of a board
        // it adds necessary event listeners also
        let showCard = ""
        for (let card of cards){
            showCard += `
                        <div class="card">
                            <div class="card-remove" id="delete-card-${card.id}"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title">${card.title}</div>
                        </div>            `
        }
        let cardContainer = document.getElementById("cardholder-"+column_id)
        cardContainer.innerHTML = showCard;
        let deleteCardButtons = document.getElementsByClassName("card-remove");
        for (let deleteBtn of deleteCardButtons) {
            deleteBtn.addEventListener('click', dom.initDeleteCard);
        }

    },
    initDeleteCard: function (event) {
        event.preventDefault();
        const idIndex = 2;
        let cardId = event.currentTarget.id.split('-')[idIndex];
        if (confirm(`Are you sure you want to delete this card?`)) {
            dataHandler.deleteCard(cardId, (response) => {
                console.log(response);
            })
        } else {
            console.log('Card is not deleted')
        }
    }
    // here comes more features
};
