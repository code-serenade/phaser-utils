// Label.ts
import Phaser from 'phaser';

export default class Label extends Phaser.GameObjects.Container {
    private labelText: Phaser.GameObjects.Text;
    private labelImage: Phaser.GameObjects.Image;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        // Text
        text: string,
        textX: number = 0,
        textY: number = 0,
        textStyle: Phaser.Types.GameObjects.Text.TextStyle = {},
        // Image
        imageKey: string,
        width?: number, // 背景图片可选宽度
        height?: number // 背景图片可选高度
    ) {
        super(scene, x, y);

        // 创建并添加图片
        this.labelImage = scene.add.image(0, 0, imageKey);
        this.labelImage.setOrigin(0.5, 0.5); // 居中对齐图片
        this.add(this.labelImage);

        // 如果传递了宽度和高度，调整图片大小
        if (width && height) {
            this.labelImage.displayWidth = width;
            this.labelImage.displayHeight = height;
        }

        // 创建并添加文本
        this.labelText = scene.add.text(textX, textY, text, textStyle);
        this.labelText.setOrigin(0.5, 0.5); // 居中对齐文本
        this.add(this.labelText);

        // 将 Label 作为一个容器添加到场景中
        scene.add.existing(this);
    }

    // 更新标签文本
    setText(newText: string) {
        this.labelText.setText(newText);
    }

    // 更新图片
    setImage(newImageKey: string, width?: number, height?: number) {
        this.labelImage.setTexture(newImageKey);
        if (width && height) {
            this.labelImage.displayWidth = width;
            this.labelImage.displayHeight = height;
        }
    }
}
