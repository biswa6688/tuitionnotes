import { Component, OnInit } from '@angular/core';
import 'zone.js/dist/zone-patch-rxjs';
import {
  toTypedRxJsonSchema,
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  RxDocument,
  RxCollection,
  RxDatabase,
  createRxDatabase
} from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';

@Component({
  selector: 'app-program-search',
  templateUrl: './program-search.component.html',
  styleUrls: ['./program-search.component.scss']
})
export class ProgramSearchComponent implements OnInit {

  txtSearch!: any;
  data: any[] = [
    {
      label: 'USA', value: 'de',
      items: [
        { label: 'Berlin', value: 'Berlin' },
        { label: 'Frankfurt', value: 'Frankfurt' },
        { label: 'Hamburg', value: 'Hamburg' },
        { label: 'Munich', value: 'Munich' }
      ]
    },
    {
      label: 'USA', value: 'us',
      items: [
        { label: 'Chicago', value: 'Chicago' },
        { label: 'Los Angeles', value: 'Los Angeles' },
        { label: 'New York', value: 'New York' },
        { label: 'San Francisco', value: 'San Francisco' }
      ]
    },
    {
      label: 'Japan', value: 'jp',
      items: [
        { label: 'Kyoto', value: 'Kyoto' },
        { label: 'Osaka', value: 'Osaka' },
        { label: 'Tokyo', value: 'Tokyo' },
        { label: 'Yokohama', value: 'Yokohama' }
      ]
    }
  ];
  searchResults: any[] = [];

  constructor() { }

  async ngOnInit(): Promise<void> {
    /**
     * create database and collections
     */
    const myDatabase: MyDatabase = await createRxDatabase<MyDatabaseCollections>({
      name: 'mydb',
      storage: getRxStorageDexie()
    });

    const heroSchema: RxJsonSchema<HeroDocType> = {
      title: 'human schema',
      description: 'describes a human being',
      version: 0,
      keyCompression: true,
      primaryKey: 'passportId',
      type: 'object',
      properties: {
        passportId: {
          type: 'string'
        },
        firstName: {
          type: 'string'
        },
        lastName: {
          type: 'string'
        },
        age: {
          type: 'integer'
        }
      },
      required: ['passportId', 'firstName', 'lastName']
    };

    const heroDocMethods: HeroDocMethods = {
      scream: function (this: HeroDocument, what: string) {
        return this.firstName + ' screams: ' + what.toUpperCase();
      }
    };

    const heroCollectionMethods: HeroCollectionMethods = {
      countAllDocuments: async function (this: HeroCollection) {
        const allDocs = await this.find().exec();
        return allDocs.length;
      }
    };

    await myDatabase.addCollections({
      heroes: {
        schema: heroSchema,
        methods: heroDocMethods,
        statics: heroCollectionMethods
      }
    });

    // add a postInsert-hook
    myDatabase.heroes.postInsert(
      function myPostInsertHook(
        this: HeroCollection, // own collection is bound to the scope
        docData: HeroDocType, // documents data
        doc: HeroDocument // RxDocument
      ) {
        console.log('insert to ' + this.name + '-collection: ' + doc.firstName);
      },
      false // not async
    );

    /**
    * use the database
    */

    // insert a document
    const hero: HeroDocument = await myDatabase.heroes.insert({
      passportId: 'myId',
      firstName: 'piotr',
      lastName: 'potter',
      age: 5
    });

    // access a property
    console.log(hero.firstName);

    // use a orm method
    hero.scream('AAH!');

    // use a static orm method from the collection
    const amount: number = await myDatabase.heroes.countAllDocuments();
    console.log(amount);


    /**
    * clean up
    */
    myDatabase.destroy();

  }

  OnSearch(event: any) {
    this.searchResults = this.data.filter((s: any) => s.label.toLowerCase().includes(event.query.toLowerCase()));
  }

}

export const heroSchemaLiteral = {
  title: 'hero schema',
  description: 'describes a human being',
  version: 0,
  keyCompression: true,
  primaryKey: 'passportId',
  type: 'object',
  properties: {
      passportId: {
          type: 'string',
          maxLength: 100 // <- the primary key must have set maxLength
      },
      firstName: {
          type: 'string'
      },
      lastName: {
          type: 'string'
      },
      age: {
          type: 'integer'
      }
  },
  required: ['firstName', 'lastName', 'passportId'],
  indexes: ['firstName']
} as const; // <- It is important to set 'as const' to preserve the literal type
const schemaTyped = toTypedRxJsonSchema(heroSchemaLiteral);

// aggregate the document type from the schema
// export type HeroDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;

// create the typed RxJsonSchema from the literal typed object.
export const heroSchema: RxJsonSchema<HeroDocType> = heroSchemaLiteral;

export type HeroDocType = {
  passportId: string;
  firstName: string;
  lastName: string;
  age?: number; // optional
};

export type HeroDocMethods = {
  scream: (v: string) => string;
};

export type HeroDocument = RxDocument<HeroDocType, HeroDocMethods>;

// we declare one static ORM-method for the collection
export type HeroCollectionMethods = {
  countAllDocuments: () => Promise<number>;
}

// and then merge all our types
export type HeroCollection = RxCollection<HeroDocType, HeroDocMethods, HeroCollectionMethods>;

export type MyDatabaseCollections = {
  heroes: HeroCollection
}

export type MyDatabase = RxDatabase<MyDatabaseCollections>;
