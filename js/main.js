

var server = [ 
  { 
    id: 1, 
    name: 'One', 
    template: ` 
          <div class='template'> 
            <div class='editable'> 
              One 
            </div> 
            <div class='container'> 
                <div class='editable'> 
                Two 
              </div> 
              <div class='editable'> 
                Three 
              </div> 
            </div> 
          </div>`, 
    modified: 1516008350380 
  }, 
  { 
    id: 2, 
    name: 'Two', 
    template: ` 
          <div class='template'> 
            <div class='container'> 
                <div class='editable'> 
                One 
              </div> 
              <div class='editable'> 
                Two 
              </div> 
              <div class='editable'> 
                Three 
              </div> 
            </div> 
            <div class='editable'> 
              Four 
            </div> 
          </div>`, 
    modified: 1516008489616 
  }, 
  { 
    id: 3, 
    name: 'Three', 
    template: ` 
          <div class='template'> 
            <div class='editable'> 
              one 
            </div> 
            <div class='editable'> 
              two 
            </div> 
            <div class='editable'> 
              three 
            </div> 
          </div>`, 
    modified: 1516008564742 
  } 
];

const MAIN_CONTAINER = getElement('.window-main');

const ROUTES = {
	LIST: 'list',
  VIEW: 'view',
	EDIT: 'edit'
};

var appState = {
  templatesList: server,
  templateBeingEditedId: null,
  currentTemplateItem: null
};

const PAGES_TEMPLATES = {
  LIST_TEMPLATE: `
    <div class="list-title-container">
      <span class="list-title">Templates List</span>
    </div>
    <div class="templates-list-wrapper"></div>
  `,
  VIEW_TEMPLTE:`
    <div class="view-title-container">
      <span class="view-title"></span>
    </div>

    <div class="view-edit-template-wrapper">
      <div class="view-template-wrapper"></div>
    
      <div class="edit-panel">

        <div class="input-text-container">
            <span class="input-text-title">Edit Text</span>
            <textarea class="input-text"></textarea>
        </div>

        <div class="font-size-container">
            <span class="font-size-title">Edit Font Size</span>
            <input type="number" class="font-size">
        </div>

        <div class="button-container">
            <button class="btn-cancel">Cancel</button>
            <button class="btn-save">Save</button>
        </div>

      </div>

    </div>
  `
};



init();


// Functions declaration

function init() {
	// Function initiates executing of the page navigation function

  formadDate();
	navigate(ROUTES.LIST);
}

function formadDate() {
//
  
appState.templatesList.forEach((template) => {
  template.modified = setDate(new Date(template.modified));
});
}

function navigate(route, idNum) {
	// Function conducts navigation between pages 

	switch (route) {
		case 'list':
			showListOfTemplates();
			break;
		case 'edit':
			showCurrTemplate(idNum);
			break;
	}
}

function showListOfTemplates() {
	//

  appState.templateBeingEditedId = null;

	MAIN_CONTAINER.innerHTML = '';
  MAIN_CONTAINER.innerHTML = PAGES_TEMPLATES.LIST_TEMPLATE;

  let templatesWrapper = getElement('.templates-list-wrapper', MAIN_CONTAINER);

  appState.templatesList.forEach((item) => {
    templatesWrapper.innerHTML += addTemplateToList(item);
  });


  [].forEach.call(templatesWrapper.getElementsByClassName('template-title-value'),
    (item, number) => {
    item.addEventListener('click', () => {
      navigate(ROUTES.EDIT, appState.templatesList[number])
    });
  });

}

function addTemplateToList(item) {
  //

  return `
    <div class="current-template-wrapper">

      <div class="template-title-container">
        <span class="template-title-property">Template:</span>
        <span class="template-title-value">${item.name}</span>
      </div>

      <div class="template-edition-date-container">
        <span class="template-edition-date-property">Last time modified:</span>
        <span class="template-edition-date-value">${item.modified}</span>
      </div>

    </div>
  `;
}


function showCurrTemplate(template) {
  //

  appState.templateBeingEdited = template;

  MAIN_CONTAINER.innerHTML = '';
  MAIN_CONTAINER.innerHTML = PAGES_TEMPLATES.VIEW_TEMPLTE;

  let templateToShow = appState.templatesList.filter(item => item.id === appState.templateBeingEdited.id)[0];

  getElement('.view-title', MAIN_CONTAINER).innerHTML = templateToShow.name;

  let viewTemplateWrapper = getElement('.view-template-wrapper', MAIN_CONTAINER);

  viewTemplateWrapper.innerHTML = templateToShow.template;

  viewTemplateWrapper.innerHTML = viewTemplateWrapper.innerHTML
      + `
        <div class="template-button-container">
          <button class="btn-back">Back</button>
          <button class="btn-save-template">Save template</button>
        </div>
      `;

  getElement('.btn-back', viewTemplateWrapper).addEventListener('click', showListOfTemplates);
  getElement('.btn-save-template', viewTemplateWrapper).addEventListener('click', (evt) => {
      saveCurrentTemplate(evt);
      showListOfTemplates();
  });
  getElement('.btn-save-template', viewTemplateWrapper).disabled = true;

  addPanel(viewTemplateWrapper);

}

function saveCurrentTemplate(evt) {
  //

  let subsidiaryContainer = document.createElement('div');
  subsidiaryContainer.appendChild(getElement('.template', MAIN_CONTAINER));

  appState.templateBeingEdited.template = subsidiaryContainer.innerHTML;
  appState.templateBeingEdited.modified = setDate(new Date());

  saveTemplateToServer();

  appState.templateBeingEdited = null;
}

function saveTemplateToServer() {
  //

  server.forEach((servElem, num) => {
    if (servElem.id === appState.templateBeingEdited.id) {
      server[num] = appState.templateBeingEdited;
    }
  });
}

function addPanel(elem) {
  //

  [].forEach.call(elem.querySelectorAll('.editable'), (editableItem) => {
    editableItem.addEventListener('click', (evt) => {showPanel(evt)});
  });

}

function showPanel(evt) {
  //

  appState.currentTemplateItem = evt.target;

  let editPanel = getElement('.edit-panel', MAIN_CONTAINER);
  let textArea = getElement('.input-text', editPanel);
  let fontSize = getElement('.font-size', editPanel);
  let btnCancel = getElement('.btn-cancel', editPanel);
  let btnSave = getElement('.btn-save', editPanel);

  textArea.value = evt.target.innerHTML.trim();

  let fontSizeStr = getComputedStyle(evt.target).fontSize;
  fontSize.value = Math.floor(fontSizeStr.substr(0, fontSizeStr.length - 2));

  btnCancel.addEventListener('click', () => {editPanel.style.display = "none";});
  btnSave.addEventListener('click', () => {
    saveTemplateItem(editPanel);
    getElement('.btn-save-template', MAIN_CONTAINER).disabled = false;
  });

  editPanel.style.display = "block";
}

function saveTemplateItem(editPanel) {
  // Function saves current template proprties in memory and sends data to the server

  appState.currentTemplateItem.innerHTML = getElement('.input-text', editPanel).value;
  appState.currentTemplateItem.style.fontSize = getElement('.font-size', editPanel).value + 'px';

  editPanel.style.display = "none";

  appState.currentTemplateItem = null;
}



function getElement(query, parentNode) {
	// Function finds node by entered query and parent node (if it is listed)  

	if (parentNode) {
		return parentNode.querySelector(query);
	} else {
		return document.body.querySelector(query);
	}
}

function setDate(date) {
  //

  return date.toDateString() + ' at ' + date.getHours() + ':' + date.getMinutes();
}


