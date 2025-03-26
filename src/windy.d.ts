// src/windy.d.ts

declare global {
    interface Window {
        WindyAPI: {
            loader: (options: {
                key: string;
                lat: number;
                lon: number;
                zoom: number;
                verbose?: boolean;
            }) => Promise<void>;
            map: any; // Adjust the type as needed for your use case
        };
    }
}

export { }; // This ensures the file is treated as a module
