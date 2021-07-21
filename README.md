# chubbyjs-mock

[![CI](https://github.com/chubbyjs/chubbyjs-mock/workflows/CI/badge.svg?branch=master)](https://github.com/chubbyjs/chubbyjs-mock/actions?query=workflow%3ACI)
[![Coverage Status](https://coveralls.io/repos/github/chubbyjs/chubbyjs-mock/badge.svg?branch=master)](https://coveralls.io/github/chubbyjs/chubbyjs-mock?branch=master)
[![Infection MSI](https://badge.stryker-mutator.io/github.com/chubbyjs/chubbyjs-mock/master)](https://dashboard.stryker-mutator.io/reports/github.com/chubbyjs/chubbyjs-mock/master)

[![bugs](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=bugs)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)
[![code_smells](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=code_smells)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)
[![coverage](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=coverage)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)
[![duplicated_lines_density](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)
[![ncloc](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=ncloc)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)
[![sqale_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)
[![alert_status](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=alert_status)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)
[![reliability_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)
[![security_rating](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=security_rating)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)
[![sqale_index](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=sqale_index)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)
[![vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=chubbyjs_chubbyjs-mock&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=chubbyjs_chubbyjs-mock)

## Description

A very strict mocking library for class based objects.

## Requirements

 * node: 10

## Installation

Through [NPM](https://www.npmjs.com) as [chubbyjs-mock][1].

```sh
npm i chubbyjs-mock@1.0
```

## Usage

```ts
import { expect, test } from '@jest/globals';
import ArgumentCallback from '@chubbyjs/chubbyjs-mock/dist/Argument/ArgumentCallback';
import ArgumentInstanceOf from '@chubbyjs/chubbyjs-mock/dist/Argument/ArgumentInstanceOf';
import Call from '@chubbyjs/chubbyjs-mock/dist/Call';
import MockByCalls from '@chubbyjs/chubbyjs-mock/dist/MockByCalls';

test('example', () => {
    class DateTimeService {
        public format(date: Date, format: string) {}
    }

    const mockByCalls = new MockByCalls();

    const dateTimeService = mockByCalls.create<DateTimeService>(DateTimeService, [
        Call.create('format').with(new ArgumentInstanceOf(Date), 'c').willReturn('2004-02-12T15:19:21+00:00'),
        Call.create('format')
            .with(new ArgumentCallback((date: Date) => expect(date).toBeInstanceOf(Date)), 'c')
            .willReturn('2008-05-23T08:12:55+00:00'),
    ]);

    expect(dateTimeService.format(new Date(), 'c')).toBe('2004-02-12T15:19:21+00:00');
    expect(dateTimeService.format(new Date(), 'c')).toBe('2008-05-23T08:12:55+00:00');
});
```

## Copyright

Dominik Zogg 2021

[1]: https://www.npmjs.com/package/chubbyjs-mock
