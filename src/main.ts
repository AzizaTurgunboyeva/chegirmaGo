import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BadRequestException, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
async function start() {
  try {
    const PORT = process.env.PORT ?? 3003;
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    // app.setGlobalPrefix("api")//swaggerdan tepaga
    const config = new DocumentBuilder()
      .setTitle("chegirmaGo")
      .setDescription(" The chegirmaGo API description")
      .setVersion("1.0")
      .addTag("chegirmaGo")
      .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("", app, documentFactory);
    app.useGlobalPipes(new ValidationPipe());
    //cors
    app.enableCors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          "http://localhost:3000",
          "http://localhost:8000",
          "http://skidkachi.uz",
          "http://skidkachi.vercel.app",
        ];
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new BadRequestException("Not allowed by Cors"));
        }
      },
      methods:"GET, HEAD,PUT,PATCH, POST,DELETE",
      credentials:true//cookie va header
    });
    await app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
}
start();
