import java.io.File;
import java.awt.Desktop;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

public class Test {
    public static void main(String[] args){
          try {
            File htmlFile = new File("dist/index.html");
            Desktop desktop = java.awt.Desktop.getDesktop();
            desktop.browse(htmlFile.toURI());
          } catch (Exception e) {
            e.printStackTrace();
          }
    }
}