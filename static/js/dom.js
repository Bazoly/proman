// It uses data_handler.js to visualize elements
import { dataHandler } from "./data_handler.js";

export let dom = {
    init: function () {
        // This function should run once, when the page is loaded.
        let boardContainer = document.getElementById("boards")
        boardContainer.innerHTML = null
        const createNewBoardButton = document.createElement("button");
        createNewBoardButton.appendChild(document.createTextNode("Create New Board"));
        createNewBoardButton.setAttribute("id", "new-board");
        let body = document.querySelector("body");
        body.insertBefore(createNewBoardButton, boardContainer);
        let newBoard = document.getElementById("new-board")
        newBoard.addEventListener("click", this.createNewBoard );
        setTimeout(dom.renameStatus, 1000)
        setTimeout(dom.renameCards, 1000)
    },

    // BOARD FUNCTIONS

    loadBoards: function () {
        // retrieves boards and makes showBoards called
        dataHandler.getBoards(function(boards){
            dom.showBoards(boards);
        });
    },
    showBoards: function (boards) {



        let boardList = '';

        for(let board of boards){
            boardList += `
        <section class="board" id="section-board-${board.id}">
            <div class="board-header" id="boardheader-${board.id}"><span class="board-title" id="boardtitle-${board.id}">${board.title}</span>
                <button class="board-add" id="board-${board.id}">Add Card</button>
                <button class="board-toggle" id="board-${board.id}"><i class="fas fa-chevron-down"></i></button>
                <button class="board-delete" id="board-${board.id}"><i class="fa fa-trash"></i></button>
             
                
            </div>
            <div class="board-columns" id="column-${board.id}"></div>
        
        </section>
            `;
        }

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.innerHTML = boardList;
        for(let board of boards) {
            this.loadStatuses(board.id)
        }
        for(let board of boards) {
            let boardTitle = document.getElementById(`boardtitle-${board.id}`)
            boardTitle.addEventListener('click', () => {
                dom.renameBoard(board.id, board.title)
            })
        }

    },
    createNewBoard: function () {
        const newBoardTitle = "New Board";
        dataHandler.createNewBoard(newBoardTitle);
        dom.loadBoards()
    },

    renameBoard: function (id, title) {
      let boardTitle = document.getElementById(`boardtitle-${id}`) ;
      boardTitle.addEventListener('click', ()=> {
            let boardDiv = document.getElementById(`boardheader-${id}`);
            boardDiv.removeChild(boardTitle);
            boardTitle = `<input class="board-title" id="title-${id}" value="${title}" maxlength="16">`;
            boardDiv.insertAdjacentHTML("afterbegin", boardTitle);
            let inputField = document.getElementById(`title-${id}`);
            inputField.addEventListener('focusout', () => {
                let title = document.getElementById(`title-${id}`).value;
                if (title === '') {
                    title = 'unnamed'
                }
                let data = {"title": title, "board_id": id};
                dataHandler.renameBoard(id, data);
            })
      })

    },

    //STATUS FUNCTIONS

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
                    <div class="board-column-title" data-id="${status.id}">${status.title}</div>
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
    renameStatus: function () {
        let boardColumnTitles = document.getElementsByClassName("board-column-title")
        for (let title of boardColumnTitles) {
            title.addEventListener("click", function (e) {
                //console.log("click")
                e.target.contentEditable = true;
                title.addEventListener("keydown", (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault()
                        let renamedStatus = title.innerHTML
                        event.target.contentEditable = false;
                        let statusId = event.target.dataset.id
                        //console.log(renamedStatus)
                        //console.log(statusId)
                        let data = {"title": renamedStatus};
                        console.log(data)
                        dataHandler.renameStatus(statusId, data, (response) => {console.log(response)})
                    }
                })
            })
        }
    },

    // CARD FUNCTIONS

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
                            <div class="card-remove"><i class="fas fa-trash-alt"></i></div>
                            <div class="card-title" data-id="${card.id}">${card.title}</div>
                        </div>            `
        }
        let cardContainer = document.getElementById("cardholder-"+column_id)
        cardContainer.innerHTML = showCard;
    },
    renameCards: function () {
        let cardTitles = document.getElementsByClassName("card-title");
        console.log(cardTitles)
        for (let cardTitle of cardTitles) {
            cardTitle.addEventListener("click", function (e) {
                e.target.contentEditable = true;
                cardTitle.addEventListener("keydown", (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault()
                        let renamedCard = cardTitle.innerHTML
                        event.target.contentEditable = false;
                        let cardId = event.target.dataset.id
                        let data = {"title": renamedCard};
                        console.log(data)
                        dataHandler.renameCards(cardId, data, (response) => {console.log(response)})
                    }
                })
            })
        }
    }
};
