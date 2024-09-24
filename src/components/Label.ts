// Label.ts
import Phaser from "phaser";

interface LabelComponentConfig {
  text: string;
  textPosition?: { x: number; y: number }; // 文本的位置
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle; // 文本的样式
  textOrigin?: { x: number; y: number }; // 文本的原点
  position?: { x: number; y: number }; // Label 的位置
  imageKey: string; // 图片的 Key
  imageSize?: { width: number; height: number }; // 图片的大小
}

export class LabelComponent extends Phaser.GameObjects.Container {
  private labelText: Phaser.GameObjects.Text;
  private labelImage: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, config: LabelComponentConfig) {
    // 使用解构赋值获取配置中的 x 和 y
    const { x, y } = config.position ?? { x: 0, y: 0 };
    super(scene, x, y);

    // 创建并添加图片
    this.labelImage = scene.add.image(0, 0, config.imageKey);
    this.labelImage.setOrigin(0.5, 0.5); // 居中对齐图片
    this.add(this.labelImage);

    // 如果传递了图片的宽度和高度，调整图片大小
    if (config.imageSize) {
      this.labelImage.displayWidth = config.imageSize.width;
      this.labelImage.displayHeight = config.imageSize.height;
    }

    // 创建并添加文本
    const { x: textX, y: textY } = config.textPosition ?? { x: 0, y: 0 };
    this.labelText = scene.add.text(
      textX, // 默认 textX 为 0
      textY, // 默认 textY 为 0
      config.text,
      config.textStyle ?? {} // 默认文本样式为空对象
    );

    // 使用传入的 origin 参数设置文本的 origin，默认值为 { x: 1, y: 0.5 }
    const textOrigin = config.textOrigin ?? { x: 0.5, y: 0.5 };
    this.labelText.setOrigin(textOrigin.x, textOrigin.y);
    this.add(this.labelText);

    // 将 Label 作为一个容器添加到场景中
    scene.add.existing(this);
  }

  // 更新标签文本
  setText(newText: string) {
    this.labelText.setText(newText);
  }

  // 更新图片
  setImage(newImageKey: string, size?: { width: number; height: number }) {
    this.labelImage.setTexture(newImageKey);
    if (size) {
      this.labelImage.displayWidth = size.width;
      this.labelImage.displayHeight = size.height;
    }
  }

  // 更新文本的 origin
  setTextOrigin(newOrigin: { x: number; y: number }) {
    this.labelText.setOrigin(newOrigin.x, newOrigin.y);
  }

  destroy(fromScene?: boolean): void {
    // 销毁文本对象
    if (this.labelText) {
      this.labelText.destroy();
    }

    // 销毁图片对象
    if (this.labelImage) {
      this.labelImage.destroy();
    }

    // 调用父类的 destroy 方法，确保整个容器被销毁
    super.destroy(fromScene);
  }
}
