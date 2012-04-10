//toggle this true/false to serve up the normal ext-all-debug.js instead

var useOriginal = false;



//specify relative path from ext-all-detail.js to 'source' folder

//Note: IE requires a relative root (fixed url does not work for IE, but is fine for Firefox)

var extRoot = '/resources/scripts/ext/'; //relative path for someExample.js

/*

default folder structure

L ext

   L adapter

   L build

   L docs

   L examples

      L someExample

         someExample.js

   L package

   L resources

   L source

   ext-all.js

   ext-all-debug.js

   ext-all-detail.js

*/



function includeFile(file) {

  if (document.createElement && document.getElementsByTagName) {

    var head = document.getElementsByTagName('head')[0];

    var script = document.createElement('script');

    script.setAttribute('type', 'text/javascript');

    script.setAttribute('src', extRoot + file);

    head.appendChild(script);

  } else {

    alert('Your browser does not handle the DOM standard well.');

  }

}



//this approach doesn't work for IE, spouts all kinds of errors (prototype, eventmanager, etc.)

//only going to ever step through with firebug anyway, so whatever Mr. Gates.

//if you disable IE debugger then it just throws a warning message

var isIE = window.ActiveXObject ? true : false;



if (useOriginal || isIE) {

    includeFile('ext-all-debug.js');    

} else {

    //file list is from http://extjs.com/forum/showthread.php?p=214963

    includeFile('source/core/DomHelper.js');          //ext core - required as of 08/30/2008

    includeFile('source/core/Template.js');           //ext core - required as of 08/30/2008

    includeFile('source/core/DomQuery.js');           //ext core - required as of 08/30/2008

    includeFile('source/util/Observable.js');         //ext core - required as of 08/30/2008

    includeFile('source/core/EventManager.js');       //ext core - required as of 08/30/2008

    includeFile('source/core/Element.js');            //ext core - required as of 08/30/2008

    includeFile('source/core/Fx.js');                 //ext core - required as of 08/30/2008

    includeFile('source/core/CompositeElement.js');   //ext core - required as of 08/30/2008

    includeFile('source/data/Connection.js');

    includeFile('source/core/UpdateManager.js');      //ext core - required as of 08/30/2008

    includeFile('source/util/Date.js');

    includeFile('source/util/DelayedTask.js');        //ext core - required as of 08/30/2008

    includeFile('source/util/TaskMgr.js');

    includeFile('source/util/MixedCollection.js');

    includeFile('source/util/JSON.js');

    includeFile('source/util/Format.js');

    includeFile('source/util/XTemplate.js');

    includeFile('source/util/CSS.js');

    includeFile('source/util/ClickRepeater.js');

    includeFile('source/util/KeyNav.js');

    includeFile('source/util/KeyMap.js');

    includeFile('source/util/TextMetrics.js');

    includeFile('source/dd/DDCore.js');

    includeFile('source/dd/DragTracker.js');

    includeFile('source/dd/ScrollManager.js');

    includeFile('source/dd/Registry.js');

    includeFile('source/dd/StatusProxy.js');

    includeFile('source/dd/DragSource.js');

    includeFile('source/dd/DropTarget.js');

    includeFile('source/dd/DragZone.js');

    includeFile('source/dd/DropZone.js');

    includeFile('source/data/SortTypes.js');

    includeFile('source/data/Record.js');

    includeFile('source/data/StoreMgr.js');

    includeFile('source/data/Store.js');

    includeFile('source/data/SimpleStore.js');

    includeFile('source/data/JsonStore.js');

    includeFile('source/data/DataField.js');

    includeFile('source/data/DataReader.js');

    includeFile('source/data/DataProxy.js');

    includeFile('source/data/MemoryProxy.js');

    includeFile('source/data/HttpProxy.js');

    includeFile('source/data/ScriptTagProxy.js');

    includeFile('source/data/JsonReader.js');

    includeFile('source/data/XmlReader.js');

    includeFile('source/data/ArrayReader.js');

    includeFile('source/data/Tree.js');

    includeFile('source/data/GroupingStore.js');

    includeFile('source/widgets/ComponentMgr.js');              //core components - 08/30/2008 - needed for widgets

    includeFile('source/widgets/Component.js');                 //core components - 08/30/2008 - needed for widgets

    includeFile('source/widgets/Action.js');                    //core components - 08/30/2008 - needed for widgets

    includeFile('source/widgets/Layer.js');                     //core components - 08/30/2008 - needed for widgets 

    includeFile('source/widgets/Shadow.js');                    //core components - 08/30/2008 - needed for widgets    

    includeFile('source/widgets/BoxComponent.js');              //core components - 08/30/2008 - needed for widgets

    includeFile('source/widgets/SplitBar.js');

    includeFile('source/widgets/Container.js');

    includeFile('source/widgets/layout/ContainerLayout.js');

    includeFile('source/widgets/layout/FitLayout.js');

    includeFile('source/widgets/layout/CardLayout.js');

    includeFile('source/widgets/layout/AnchorLayout.js');

    includeFile('source/widgets/layout/ColumnLayout.js');

    includeFile('source/widgets/layout/BorderLayout.js');

    includeFile('source/widgets/layout/FormLayout.js');

    includeFile('source/widgets/layout/AccordionLayout.js');

    includeFile('source/widgets/layout/TableLayout.js');

    includeFile('source/widgets/layout/AbsoluteLayout.js');

    includeFile('source/widgets/Viewport.js');

    includeFile('source/widgets/Panel.js');

    includeFile('source/widgets/Window.js');

    includeFile('source/widgets/WindowManager.js');

    includeFile('source/widgets/PanelDD.js');

    includeFile('source/state/Provider.js');

    includeFile('source/state/StateManager.js');

    includeFile('source/state/CookieProvider.js');

    includeFile('source/widgets/DataView.js');

    includeFile('source/widgets/ColorPalette.js');

    includeFile('source/widgets/DatePicker.js');

    includeFile('source/widgets/TabPanel.js');

    includeFile('source/widgets/Button.js');

    includeFile('source/widgets/SplitButton.js');

    includeFile('source/widgets/CycleButton.js');

    includeFile('source/widgets/Toolbar.js');

    includeFile('source/widgets/PagingToolbar.js');

    includeFile('source/widgets/Resizable.js');

    includeFile('source/widgets/Editor.js');

    includeFile('source/widgets/MessageBox.js');

    includeFile('source/widgets/tips/Tip.js');

    includeFile('source/widgets/tips/ToolTip.js');

    includeFile('source/widgets/tips/QuickTip.js');

    includeFile('source/widgets/tips/QuickTips.js');

    includeFile('source/widgets/tree/TreePanel.js');

    includeFile('source/widgets/tree/TreeEventModel.js');

    includeFile('source/widgets/tree/TreeSelectionModel.js');

    includeFile('source/widgets/tree/TreeNode.js');

    includeFile('source/widgets/tree/AsyncTreeNode.js');

    includeFile('source/widgets/tree/TreeNodeUI.js');

    includeFile('source/widgets/tree/TreeLoader.js');

    includeFile('source/widgets/tree/TreeFilter.js');

    includeFile('source/widgets/tree/TreeSorter.js');

    includeFile('source/widgets/tree/TreeDropZone.js');

    includeFile('source/widgets/tree/TreeDragZone.js');

    includeFile('source/widgets/tree/TreeEditor.js');

    includeFile('source/widgets/menu/Menu.js');

    includeFile('source/widgets/menu/MenuMgr.js');

    includeFile('source/widgets/menu/BaseItem.js');

    includeFile('source/widgets/menu/TextItem.js');

    includeFile('source/widgets/menu/Separator.js');

    includeFile('source/widgets/menu/Item.js');

    includeFile('source/widgets/menu/CheckItem.js');

    includeFile('source/widgets/menu/Adapter.js');

    includeFile('source/widgets/menu/DateItem.js');

    includeFile('source/widgets/menu/ColorItem.js');

    includeFile('source/widgets/menu/DateMenu.js');

    includeFile('source/widgets/menu/ColorMenu.js');

    includeFile('source/widgets/form/Field.js');

    includeFile('source/widgets/form/TextField.js');

    includeFile('source/widgets/form/TriggerField.js');

    includeFile('source/widgets/form/TextArea.js');

    includeFile('source/widgets/form/NumberField.js');

    includeFile('source/widgets/form/DateField.js');

    includeFile('source/widgets/form/Combo.js');

    includeFile('source/widgets/form/Checkbox.js');

    includeFile('source/widgets/form/CheckboxGroup.js');

    includeFile('source/widgets/form/Radio.js');

    includeFile('source/widgets/form/RadioGroup.js');

    includeFile('source/widgets/form/Hidden.js');

    includeFile('source/widgets/form/BasicForm.js');

    includeFile('source/widgets/form/Form.js');

    includeFile('source/widgets/form/FieldSet.js');

    includeFile('source/widgets/form/HtmlEditor.js');

    includeFile('source/widgets/form/TimeField.js');

    includeFile('source/widgets/form/Label.js');

    includeFile('source/widgets/form/Action.js');

    includeFile('source/widgets/form/VTypes.js');

    includeFile('source/widgets/grid/GridPanel.js');

    includeFile('source/widgets/grid/GridView.js');

    includeFile('source/widgets/grid/GroupingView.js');

    includeFile('source/widgets/grid/ColumnDD.js');

    includeFile('source/widgets/grid/ColumnSplitDD.js');

    includeFile('source/widgets/grid/GridDD.js');

    includeFile('source/widgets/grid/ColumnModel.js');

    includeFile('source/widgets/grid/AbstractSelectionModel.js');

    includeFile('source/widgets/grid/RowSelectionModel.js');

    includeFile('source/widgets/grid/CellSelectionModel.js');

    includeFile('source/widgets/grid/EditorGrid.js');

    includeFile('source/widgets/grid/GridEditor.js');

    includeFile('source/widgets/grid/PropertyGrid.js');

    includeFile('source/widgets/grid/RowNumberer.js');

    includeFile('source/widgets/grid/CheckboxSelectionModel.js');

    includeFile('source/widgets/LoadMask.js');

    includeFile('source/widgets/ProgressBar.js');

    includeFile('source/widgets/Slider.js');

    includeFile('source/widgets/StatusBar.js');

    includeFile('source/util/History.js');

    includeFile('source/debug.js');

} 

