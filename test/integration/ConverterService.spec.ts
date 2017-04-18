import "../TestHelper";
import {ControllerRegistry} from "../../src/mvc/ControllerRegistry";
import {BodyParam, PathParam, QueryParam, Res} from "../../src/mvc/decorator/Params";
import {Get, Post} from "../../src/mvc/decorator/Method";
import {ServerHelper} from "../helper/ServerHelper";
import {RestController} from "../../src/mvc/decorator/Controller";
import * as Express from "express";
import {HttpHelper} from "../helper/HttpHelper";
import {ObjectProperty} from "../../src/converter/decorator/ObjectProperty";
import {bootstrap} from "../../src/testing/bootstrap";


describe('[Integration] ConverterService', () => {

    const d1 = new Date();
    const d2 = new Date();

    class Filter {

        @ObjectProperty()
        public name: string;

        @ObjectProperty({baseType: Number})
        public ids: number[];

        @ObjectProperty("created_at")
        public createdAt: Date;

        @ObjectProperty("is_draft")
        public isDraft: boolean;
    }

    @RestController()
    class UserController {

        @Get("/users")
        public indexAction(@QueryParam("filter") filter: Filter,
                           @Res() res: Express.Response) {

            if (!(filter instanceof Filter)) {
                return res.send('1');
            }

            if (filter.name !== 'abc') {
                return res.send('2');
            }

            if (!(filter.ids instanceof Array)) {
                return res.send('3');
            }

            [1, 2, 3].forEach((i, index) => {
                if (filter.ids[index] !== i) {
                    return res.send('4');
                }
            });

            if (!(filter.createdAt instanceof Date)) {
                return res.send('5');
            }

            if (filter.createdAt.getTime() !== d1.getTime()) {
                return res.send('6');
            }

            if (filter.isDraft !== true) {
                return res.send('7');
            }

            return res.send(true);
        }

        @Get("/users/:id")
        public showAction(@PathParam("id") id: number,
                          @Res() res: Express.Response) {

            const flag = id === 1;
            res.send(flag);
        }

        @Post("/users")
        public createAction(@BodyParam('filter') filter: Filter,
                            @Res() res: Express.Response) {

            if (!(filter instanceof Filter)) {
                return res.send('1');
            }

            if (filter.name !== 'abc') {
                return res.send('2');
            }

            if (!(filter.ids instanceof Array)) {
                return res.send('3');
            }

            [1, 2, 3].forEach((i, index) => {
                if (filter.ids[index] !== i) {
                    return res.send('4');
                }
            });

            if (!(filter.createdAt instanceof Date)) {
                return res.send('5');
            }

            if (filter.createdAt.getTime() !== d1.getTime()) {
                return res.send('6');
            }

            if (filter.isDraft !== true) {
                return res.send('7');
            }

            return res.send(true);
        }
    }

    bootstrap(UserController, 4444);

    const filter = {
        name: "abc",
        ids: [1, 2, 3],
        created_at: d1,
        is_draft: true
    };

    it('should convert a QueryParam', () => {


        const options = {
            qs: {
                filter
            }
        };

        return HttpHelper.sendRequest("get", "http://localhost:4444/users", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal(true);
        });
    });



    it('should convert a PathParam', () => {

        return HttpHelper.sendRequest("get", "http://localhost:4444/users/1", undefined, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal(true);
        });

    });

    it('should convert a BodyParam', () => {

        const options = {
            body: {
                filter
            }
        };

        return HttpHelper.sendRequest("post", "http://localhost:4444/users", options, (response) => {
            response.statusCode.should.be.equal(200);
            response.body.should.be.equal(true);
        });

    });



});