import { Injectable } from '@nestjs/common';
import {Api, TelegramClient} from 'telegram';
import { StringSession } from 'telegram/sessions';
import * as process from 'process';
import * as input from 'input';
import phone = Api.phone;
@Injectable()
export class TelegramService {
    private client: TelegramClient;
    private apiId: number;
    private phone: string;
    private apiHash: string;
    private stringSession: StringSession;

    constructor() {
        this.apiId = +process.env["API_ID"]; // Ваш API ID
        this.apiHash = process.env["API_HASH"];
        this.phone = process.env["TG_NUMBER"];
        this.stringSession = new StringSession(""); // Значение из сессии, чтобы избежать повторной аутентификации

        this.client = new TelegramClient(this.stringSession, this.apiId, this.apiHash, {
            connectionRetries: 5,
        });
    }

    async start() {
        console.log("Loading interactive example...");
        await this.client.start({
            phoneNumber: async () => await input.text(`${phone}`),
            phoneCode: async () => await input.text("Code ?"),
            onError: (err) => console.log(err),
        });
        console.log("You should now be connected.");
        console.log(this.client.session.save());
    }
    // console.log(this.client.session.save()); // Save this string to avoid logging in again
    // Другие методы, которые могут понадобиться для взаимодействия с Telegram API

}
