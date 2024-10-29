import Phaser from "phaser";

interface ButtonComponentConfig {
  position?: { x: number; y: number };
  defaultTexture: string; // 默认状态下的纹理
  clickedTexture: string; // 点击状态下的纹理
  imageSize?: { width: number; height: number }; // 图片的大小
  text?: string; // 将 text 设置为可选
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle;
  callback?: () => void;
}

export class ButtonComponent extends Phaser.GameObjects.Container {
  private buttonImage: Phaser.GameObjects.Image;
  private buttonText?: Phaser.GameObjects.Text; // 将 buttonText 设置为可选
  private defaultTexture: string; // 默认状态的纹理
  private clickedTexture: string; // 点击后的纹理
  private enabled: boolean; // 添加 enabled 属性

  constructor(scene: Phaser.Scene, config: ButtonComponentConfig) {
    const { x, y } = config.position ?? { x: 0, y: 0 };
    super(scene, x, y);

    this.defaultTexture = config.defaultTexture;
    this.clickedTexture = config.clickedTexture;
    this.enabled = true; // 初始化为启用状态

    // 创建按钮的背景图像
    this.buttonImage = scene.add.image(0, 0, this.defaultTexture);

    // 如果提供了宽度和高度参数，则调整图像大小
    if (config.imageSize) {
      this.buttonImage.setDisplaySize(
        config.imageSize.width,
        config.imageSize.height
      );
    }

    this.add(this.buttonImage);

    // 如果提供了文本，则创建按钮的文本
    if (config.text) {
      this.buttonText = scene.add.text(0, 0, config.text, config.textStyle);
      this.buttonText.setOrigin(0.5, 0.5);

      // 调整文本的缩放比例，以适应按钮的大小
      if (config.imageSize) {
        const scaleX = config.imageSize.width / this.buttonImage.width;
        const scaleY = config.imageSize.height / this.buttonImage.height;
        this.buttonText.setScale(Math.min(scaleX, scaleY));
      }

      this.add(this.buttonText);
    }

    // 使按钮可交互
    this.buttonImage.setInteractive();

    // 添加点击事件
    this.buttonImage.on("pointerdown", () => {
      if (this.enabled) {
        this.buttonImage.setTexture(this.clickedTexture); // 切换到点击状态的纹理
      }
    });

    // 添加释放事件，恢复默认状态
    this.buttonImage.on("pointerup", () => {
      if (this.enabled) {
        this.buttonImage.setTexture(this.defaultTexture); // 恢复默认状态的纹理
      }
      if (config.callback) {
        config.callback();
      }
    });

    // 添加鼠标移出事件，确保在鼠标移出时恢复默认状态
    this.buttonImage.on("pointerout", () => {
      if (this.enabled) {
        this.buttonImage.setTexture(this.defaultTexture); // 恢复默认状态的纹理
      }
    });
  }

  // 可选的设置文本方法
  public setText(newText: string): void {
    if (this.buttonText) {
      this.buttonText.setText(newText);
    }
  }

  // 可选的设置文本样式方法
  public setTextStyle(style: Phaser.Types.GameObjects.Text.TextStyle): void {
    if (this.buttonText) {
      this.buttonText.setStyle(style);
    }
  }

  // 更新的设置按钮大小的方法，返回 this
  public setButtonSize(width: number, height: number): this {
    this.buttonImage.setDisplaySize(width, height);
    if (this.buttonText) {
      const scaleX = width / this.buttonImage.width;
      const scaleY = height / this.buttonImage.height;
      this.buttonText.setScale(Math.min(scaleX, scaleY));
    }
    return this;
  }

  // 启用按钮
  public enable(): void {
    this.enabled = true;
    this.buttonImage.setInteractive();
    this.setAlpha(1); // 恢复全透明度
  }

  // 禁用按钮
  public disable(): void {
    this.enabled = false;
    this.buttonImage.disableInteractive();
    this.setAlpha(0.5); // 使按钮半透明以表示禁用状态
  }

  // 显示按钮
  public show(): void {
    this.setVisible(true);
  }

  // 隐藏按钮
  public hide(): void {
    this.setVisible(false);
  }
}
