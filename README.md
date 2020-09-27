# Split

# Disclaimer: this is not official SplitSoftware software, this is a third party Intergration Library

An Angular Library for working with [SplitIO](https://split.io) Javascript SDK.

You can see it in action here: [Demo](https://breningham.github.io/split/).

## Installation

You will need a SplitIO Account (get one here: [SplitIO](https://split.io) )

and you will want to install the splitSDK via npm/yarn

- via npm `npm install @splitsoftware/splitio`
- via yarn `yarn add @splitsoftware/splitio`

and then install this package:

- via npm: `npm install @inghamdev/split`
- via yarn `yarn add @inghamdev/split`

## Usage

import the `SpliteCoreModule` into your AppModule and import it using the `.forRoot` method. you will need to pass your split configuration via the input params like so:

```(ts)
// Simplest Import possible.

import {  } from '@inghamdev/split';

@NgModule({
    imports: [
        SplitCoreModule.forRoot({
            core: {
                authorizationKey: 'YOUR-KEY-HERE'
            }
        })
    ]
})

```

#### More to come..
