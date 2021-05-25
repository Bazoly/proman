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
        console.log(boards);

        let boardList = '';

        for(let board of boards){
            boardList += `
        <section class="board" id="board-${board.id}">
            <div class="board-header" id="board-${board.id}"><span class="board-title" id="board-${board.id}">${board.title}</span>
                <button class="board-add" id="board-${board.id}">Add Card</button>
                <button class="board-toggle" id="board-${board.id}"><i class="fas fa-chevron-down"></i></button>
                <button class="board-delete" id="board-${board.id}"><i class="fa fa-trash"></i></button>
                
            </div>
        
        </section>
            `;
        }

        let boardsContainer = document.querySelector('#boards');
        boardsContainer.innerHTML = boardList;
    },
    loadCards: function (boardId) {
        // retrieves cards and makes showCards called
    },
    showCards: function (cards) {
        // shows the cards of a board
        // it adds necessary event listeners also
    },
    // here comes more features
};
