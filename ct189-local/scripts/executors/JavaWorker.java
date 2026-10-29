import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class JavaWorker {
  public static void main(String[] args) throws Exception {
    try (InputStream input = System.in) {
      String body = new String(input.readAllBytes(), StandardCharsets.UTF_8);
      String callback = field(body, "callbackUrl");
      if (callback == null || callback.isBlank()) throw new IllegalArgumentException("missing callbackUrl");
      HttpRequest request = HttpRequest.newBuilder(URI.create(callback))
          .header("Content-Type", "application/json")
          .POST(HttpRequest.BodyPublishers.ofString(body))
          .build();
      HttpResponse<String> response = HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.ofString());
      System.out.println(response.body());
      if (response.statusCode() < 200 || response.statusCode() >= 300) System.exit(1);
    }
  }

  private static String field(String json, String name) {
    String marker = "\"" + name + "\"";
    int start = json.indexOf(marker);
    if (start < 0) return null;
    start = json.indexOf(':', start) + 1;
    while (start < json.length() && Character.isWhitespace(json.charAt(start))) start++;
    if (start >= json.length() || json.charAt(start) != '\"') return null;
    int end = json.indexOf('"', start + 1);
    return end < 0 ? null : json.substring(start + 1, end);
  }
}
