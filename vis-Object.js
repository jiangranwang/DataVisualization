/**
 * Class that represents a Margin object for SVG
 * or any other display object.
 */
class Margin {
    /**
     * Constructor to create a margin for SVG, html document,
     * and any other display object.
     * 
     * @param {int} top the top margin by pixel
     * @param {int} bottom the bottom margin by pixel
     * @param {int} left the left margin by pixel
     * @param {int} right the right margin by pixel
     */
    constructor (top, bottom, left, right) {
        this.top = top;
        this.bottom = bottom;
        this.left = left;
        this.right = right;
    }
}