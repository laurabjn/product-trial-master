import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import express from "express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "E-commerce API",
            version: "1.0.0",
            description: "API documentation for e-commerce module",
        },
        components: {
            securitySchemes: {
                BearerAuth: { // Correction ici
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        username: { type: "string" },
                        firstname: { type: "string" },
                        email: { type: "string" },
                        password: { type: "string" },
                    },
                },
                Product: {
                    type: "object",
                    properties: {
                        code: { type: "string" },
                        name: { type: "string" },
                        description: { type: "string" },
                        image: { type: "string" },
                        category: { type: "string" },
                        price: { type: "number" },
                        quantity: { type: "number" },
                        internalReference: { type: "string" },
                        shellId: { type: "number" },
                        inventoryStatus: { type: "string", enum: ["INSTOCK", "LOWSTOCK", "OUTOFSTOCK"] },
                        rating: { type: "number" },
                    },
                },
            },
        },
        servers: [{ url: "http://localhost:5000/api" }],
    },
    apis: ["./src/routes/*.ts"], // files containing annotations as above
};

const swaggerSpec = swaggerJSDoc(options);

export function setupSwagger(app: express.Application) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get("/api-docs.json", (req, res) => {
        res.json(swaggerSpec);
    });
    console.log("Swagger documentation available at http://localhost:5000/api-docs");
}
