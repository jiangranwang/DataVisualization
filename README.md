# Data Visualization for Domestic Student Distribution

CS 296 group project in Spring 2019. Contributor: Mingjie Zhao, Hanzhi Yin, Zhengguan Dai, and Jiangran Wang.

# How to run this program
* clone this repository
* run ```python3 -m http.server```
* open the browser with url ```http://0.0.0.0:8000/```
* navigate to the folder where this project folder is cloned, and the main page will be displayed automatically

# Demo
* To see the number of students in different years, drag the scroll bar on top of the page to specific year. The map will automatically change its color based on the number of students in that state, and the light colored line on the right plot will also move based on the current year. 
![scroll](images/scroll1.png?raw=true)
![scroll](images/scroll2.png?raw=true)

* Each line in the right plot represents the trend of a state. The vertical axis is convert to log scale for better visualization. Detailed information will be displayed if mouseover the map or the dotted line. To remove a line in the plot, click on it.
![scroll](images/mouseover.png?raw=true)