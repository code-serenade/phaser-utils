import Phaser from "phaser";
import Button from "./Button"; // 假设你已将Button类保存为Button.ts

export interface ButtonGridConfig {
  x: number; // 网格的起始 x 坐标
  y: number; // 网格的起始 y 坐标
  rows: number; // 行数
  cols: number; // 列数
  spacingX: number; // 按钮之间的水平间距
  spacingY: number; // 按钮之间的垂直间距
  defaultTexture: string; // 默认状态的按钮纹理
  clickedTexture: string; // 点击状态的按钮纹理
  buttonWidth: number; // 按钮宽度
  buttonHeight: number; // 按钮高度
  buttonTexts?: string[]; // 按钮文本数组
  textStyle?: Phaser.Types.GameObjects.Text.TextStyle; // 按钮文本样式
  callbacks?: (() => void)[]; // 回调函数数组
}

export class ButtonGrid {
  private scene: Phaser.Scene;
  private buttonGroup: Phaser.GameObjects.Group;
  private config: ButtonGridConfig;

  constructor(scene: Phaser.Scene, config: ButtonGridConfig) {
    this.scene = scene;
    this.config = config;
    this.buttonGroup = this.scene.add.group();

    this.createButtons();
  }

  private createButtons(): void {
    const {
      x: startX,
      y: startY,
      rows,
      cols,
      spacingX,
      spacingY,
      defaultTexture,
      clickedTexture,
      buttonWidth,
      buttonHeight,
      buttonTexts = [],
      textStyle,
      callbacks = [],
    } = this.config;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (buttonWidth + spacingX);
        const y = startY + row * (buttonHeight + spacingY);

        const textIndex = row * cols + col;
        const buttonText = buttonTexts[textIndex] || `Button ${textIndex + 1}`;
        const callback = callbacks[textIndex];

        const button = new Button(
          this.scene,
          x,
          y,
          defaultTexture,
          clickedTexture,
          buttonWidth,
          buttonHeight,
          buttonText,
          textStyle,
          callback
        );

        this.buttonGroup.add(button);
      }
    }
  }

  public getGroup(): Phaser.GameObjects.Group {
    return this.buttonGroup;
  }

  public setInteractive(enabled: boolean): void {
    this.buttonGroup.children.iterate(
      (button: Phaser.GameObjects.GameObject) => {
        if (enabled) {
          (button as Button).enable();
        } else {
          (button as Button).disable();
        }
        return true; // 返回 true 以继续遍历
      }
    );
  }
}
