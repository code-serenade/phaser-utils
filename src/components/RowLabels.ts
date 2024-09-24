import Phaser from "phaser";
import { LabelComponent } from "./Label";

interface RowLabelComponentConfig {
  texts: string[];
  images: string[];
  position?: { x: number; y: number };
  imageSize: { width: number; height: number }; // 图片的大小
  spacing?: number;
  textPosition?: { x: number; y: number }; // 文本的位置
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle; // 文本的样式
  textOrigin?: { x: number; y: number }; // 文本的原点
}

export class RowLabelComponent extends Phaser.GameObjects.Container {
  private labelComponents: LabelComponent[] = [];
  private images: string[];
  private texts: string[];
  private imageSize: { width: number; height: number };
  private spacing: number;

  constructor(scene: Phaser.Scene, config: RowLabelComponentConfig) {
    const { x, y } = config.position ?? { x: 0, y: 0 };
    super(scene, x, y);

    this.images = config.images;
    this.texts = config.texts;
    this.imageSize = config.imageSize;
    this.spacing = config.spacing ?? 5;

    this.initialize(scene, config.textStyle ?? {});
    scene.add.existing(this);
  }

  private initialize(
    scene: Phaser.Scene,
    textStyle: Phaser.Types.GameObjects.Text.TextStyle
  ) {
    const numItems = Math.min(this.images.length, this.texts.length);
    for (let i = 0; i < numItems; i++) {
      const labeledSprite = new LabelComponent(scene, {
        imageKey: this.images[i],
        text: this.texts[i],
        imageSize: {
          width: this.imageSize.width,
          height: this.imageSize.height,
        },
        textStyle: textStyle,
      });

      this.labelComponents.push(labeledSprite);
      this.add(labeledSprite);
    }

    this.arrangeLabels(scene);
  }

  private arrangeLabels(scene: Phaser.Scene) {
    const totalWidth =
      this.labelComponents.length * (this.imageSize.width + this.spacing) -
      this.spacing;
    const startX = (scene.scale.width - totalWidth) / 2;

    this.labelComponents.forEach((component, index) => {
      const x = startX + index * (this.imageSize.width + this.spacing);
      component.setPosition(x, this.y);
    });
  }

  destroy(fromScene?: boolean): void {
    // 如果有需要手动移除的事件监听器或计时器，可以在这里处理

    // 依次销毁所有 LabelComponent 实例
    this.labelComponents.forEach((label) => {
      label.destroy();
    });

    // 调用父类的 destroy 方法，清理自身
    super.destroy(fromScene);
  }
}
