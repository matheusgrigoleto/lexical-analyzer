var tokenAddI = $('.inputToken')[0];
var tokenAddB = $('.clickToken')[0];
var textAreaValidated = $('.validate-tokens')[0];
var enter = 13;
var space = 32;
var backspace = 8;
var counterID = 0;
var map = new Map();
var stateTable = ['q0']; 
var stateActual = '';

//Validação dos caracteres da text area//
var validChar = function (e) {
    var keyCode = (e.sth) ? e.sth : e.keyCode;

    if (e.type == "keydown") {
        if (keyCode <= 90 && keyCode >= 48) {
            charValidate(e.key.toLowerCase(), true);
        } else if (keyCode == enter || keyCode == space || keyCode == backspace) {
            charValidate(keyCode, true);
        }
    }
};

textAreaValidated.addEventListener('keydown', validChar, true);
//end//

//Faz o backtracking//
function charValidate(charSelect, showRow) {
    var backTracking = false;
    var previousStateCodeForAnimate = this.stateActual;

    if (charSelect == enter || charSelect == space) {
        var actualState = this.map.get(this.stateActual);
        if (actualState.isTerminal) {
            this.stateActual = 'q0';
        } else {
            this.stateActual = 'error';
        }
    } else if (charSelect == backspace) {
        if (this.stateTable.length - 1 > 0) {
            this.stateTable.pop();
            this.stateActual = this.stateTable[this.stateTable.length - 1];
        }
        backTracking = true;
    } else {
        this.stateActual = this.getStateTransition(this.stateActual, charSelect);
        if (this.stateActual == undefined) {
            this.stateActual = 'error';
            if (this.map.get(this.stateActual) == undefined) {
                this.createErrorState();
            }
        }
    }
    if (!backTracking) {
        this.stateTable.push(this.stateActual);
    }
    if (showRow) {
        actualizeState(previousStateCodeForAnimate, this.stateActual);
        tableScroll();
    }
};
//end//

//Revalida o status//
function revalidateCurrentState() {
    var inputs = textAreaValidated.value.toLowerCase();
    this.stateTable = ["q0"];
    this.stateActual = 'q0';
    var entryKey;
    var entryKeyCode;
    for (var i = 0; i < inputs.length; i++) {
        entryKey = inputs[i];
        entryKeyCode = entryKey.charCodeAt(0);
        if (entryKeyCode == 10 || entryKeyCode == enter) {
            entryKey = enter;
        } else if (entryKeyCode == 32 || entryKeyCode == space) {
            entryKey = space;
        }
        var showRow = (i == inputs.length - 1);
        this.validateEntry(entryKey, showRow);
    }
};
//end//

//Faz o check das palavras do submit vendo se as palavras são válidas//
//Adicionando as palavras ao clicar a tecla enter//
var verificAddToken = function (e) {
    var keyCode = (e.sth) ? e.sth : e.keyCode;
    if (keyCode == enter) {
        addToken();
    }
}

tokenAddI.addEventListener('keydown', verificAddToken, true);

function addToken() {
    var tokensToAdd = $('.inputToken')[0].value.split(' ');
    for (var i = 0; i < tokensToAdd.length; i++) {
        addTokens(tokensToAdd[i].replace(/[^a-z]/gi, ''));
    }
    $('.inputToken')[0].value = '';
};
//end//

//Adiciona status da tabela
function addRow(state) {
    var automatoTableBody = $('.bodyTable')[0];
    var cellHtml;
    var cell = '<td id="STATE_ID-LETTER" class="cell">-</td>'
    var rowHtml = '<tr id="STATE_ID" class="tColumns" IS_TERMINAL_TITLE>COLUMNS</tr>';
    var rowContentHtml = '<th id="STATE_ID-id" class="automato-column-id">IS_TERMINALSTATE_ID</th>';
    rowHtml = rowHtml.replace(/IS_TERMINAL_TITLE/g, ((state.isTerminal) ? 'title="Estado terminal"' : ''));
    rowContentHtml = rowContentHtml.replace(/IS_TERMINAL/g, ((state.isTerminal) ? '*' : ''));

    for (var i = 65; i <= 90; i++) {
        cellHtml = cell.replace(/LETTER/g, String.fromCharCode(i).toLowerCase());
        rowContentHtml += cellHtml;
    }
    rowHtml = rowHtml.replace(/COLUMNS/g, rowContentHtml);
    rowHtml = rowHtml.replace(/STATE_ID/g, state.id);
    automatoTableBody.innerHTML += rowHtml;
};
//end//

//Adiciona um novo estado de transição//
function addTransition(previousStateCode, charSelect, nextStateCode) {
    var query = '#' + previousStateCode + '-' + charSelect;
    $(query)[0].innerHTML = nextStateCode;
};

//Scrolla para a palavra selecionada//
function tableScroll() {
    var divToScroll = $(".body-column.body-right-column");
    if (stateActual != 'error') {
        var scrollUntilState = $('#' + stateActual);
        divToScroll.scrollTop(
            scrollUntilState.offset().top - divToScroll.offset().top + divToScroll.scrollTop()
        );
    }
};

//Adiciona novo Token ao text area//
function updateTokens(validTokens) {
    var validTokenTextArea = $('.valid-tokens')[0];
    validTokens.sort();
    validTokenTextArea.value = '-' + validTokens[0];
    for (var i = 1; i < validTokens.length; i++) {
        validTokenTextArea.value += ('\n-' + validTokens[i]);
    }
};


//Atualiza o estado das linhas de acordo com o que está mostrado//
function actualizeState(previousStateCode, stateActual) {
    var previousStateRow = document.getElementById(previousStateCode);
    var actualStateRow = document.getElementById(stateActual)

    if (previousStateRow != undefined) {
        previousStateRow.className = 'tColumns';
    }
    if (actualStateRow != undefined) {
        actualStateRow.className += ' actual-state';
    }
    if (stateActual == "error") {
        textAreaValidated.className += " error";
    } else {
        textAreaValidated.className = "text-area validate-tokens";
    }
};

//Cria um estado para o id//
function State(id) {
    this.id = id,
        this.isTerminal = false,
        this.isInitial = false,
        this.transitions = new Map()
};

//Adiciona um novo token//
var tokens = [];
function addTokens(token) {
    if (!(token != '' && token != undefined && token != null)) {
        return;
    }
    token = token.toLowerCase();
    if (!(this.tokens.indexOf(token) > -1)) {
        this.tokens.push(token);
        updateTokens(this.tokens);
        addNewToken(token);
    }
}

tokenAddB.addEventListener("click", addToken(), true);
//end//

//Elemento map
function getmap() {
    return map;
};

//Contador//
function getNewId() {
    return 'q' + (++counterID);
};

//Estado inicial do código//
function createInitialState(initialStateCode) {
    if (initialStateCode == undefined || initialStateCode == '') {
        initialStateCode = 'q0';
    }
    initialState = new State(initialStateCode);
    initialState.isInitial = true;
    initialState.isTerminal = true;
    this.map.set(initialStateCode, initialState);
    this.stateActual = 'q0';
};
//end//

//Cria um novo estado terminal, seta um id a ele e mapeia para uma nova linha
function createNewState(isTerminal) {
    newState = new State(this.getNewId());
    newState.isTerminal = isTerminal;
    map.set(newState.id, newState);
    addRow(newState);
    return newState;
};

//Transição do estado quando ele for null ou undefined//
function getStateTransition(previousStateCode, charSelect) {
    var trnState = map.get(previousStateCode);
    if (trnState != undefined && trnState != null) {
        return trnState.transitions.get(charSelect);
    } else {
        return undefined;
    }
};

//Cria um novo estado de transição retornonando esse novo estado//
function createNewStateTransition(previousStateCode, charSelect, isTerminalBoolean) {
    newState = this.createNewState(isTerminalBoolean);
    map.get(previousStateCode).transitions.set(charSelect, newState.id);
    addTransition(previousStateCode, charSelect, newState.id);
    return newState.id;
};

//Seta o estado Terminal//
function setStateTerminal(stateId) {
    map.get(stateId).isTerminal = true;
};

//Adiciona um estado, caso não exista criar um//
function addState(previousStateCode, charSelect, isTerminalBoolean)
{
    if (map.get(previousStateCode) == undefined) {
        this.createInitialState(previousStateCode);
    }

    var auxStateCode = this.getStateTransition(previousStateCode, charSelect);
    if (auxStateCode == undefined || auxStateCode == null) {
        auxStateCode = this.createNewStateTransition(previousStateCode, charSelect, isTerminalBoolean);
    } else {
        if (isTerminalBoolean) {
            this.setStateTerminal(auxStateCode);
        }
    }
    return auxStateCode;
};
//end//

//Adiciona um novo token ao estado inicial e revalida o estado atual//
function addNewToken(token) {
    var tempStateCode = 'q0';
    var charSelect = '';
    for (var i = 0; i < token.length; i++) {
        charSelect = token[i];
        tempStateCode = this.addState(tempStateCode, charSelect, (i == token.length - 1));
    }
    revalidateCurrentState();
};

//Cria um estado de erro
function createErrorState() {
    newState = new State('error');
    newState.isTerminal = false;
    map.set('error', newState);
};
//end//
