import { Control } from "@logicflow/extension";
import LogicFlow from "@logicflow/core";
import "bpmn-font/dist/css/bpmn.css";
import { Ref } from "vue";

const createMapItem = (lf: LogicFlow) => {
  return {
    iconClass: "icon-minimap",
    title: "",
    text: "导航",
    onClick(lf: LogicFlow, ev: MouseEvent) {
      const position = lf.getPointByClient(ev.x, ev.y);
      lf.extension.miniMap?.show(
        position.domOverlayPosition.x - 120,
        position.domOverlayPosition.y + 35,
      );
    },
  };
};

const createUploadItem = (lf: LogicFlow) => {
  return {
    iconClass: "icon-upload",
    text: "上传",
  };
};

const createDownloadItem = (lf: LogicFlow) => {
  return {
    iconClass: "icon-download",
    text: "下载",
  };
};

const createXmlItem = (lf: LogicFlow) => {
  return {
    iconClass: "icon-xml",
    text: "XML",
    onClick(lf: LogicFlow) {
      if (!CustomControl.xmlVisibleRef) return;
      console.log(123, CustomControl.xmlVisibleRef.value);
      CustomControl.xmlVisibleRef.value = !CustomControl.xmlVisibleRef.value;
    },
  };
};

const createItems = (lf: LogicFlow) => [
  createMapItem(lf),
  createUploadItem(lf),
  createDownloadItem(lf),
  createXmlItem(lf),
];
export default class CustomControl extends Control {
  static xmlVisibleRef: Ref<boolean>;
  constructor(args: { lf: LogicFlow }) {
    super(args);
    const { lf } = args;
    const items = createItems(lf);
    items.forEach(item => {
      super.addItem(item);
    });
  }
  setXmlVisibleRef(visibleRef: Ref<boolean>) {
    CustomControl.xmlVisibleRef = visibleRef;
  }
}
