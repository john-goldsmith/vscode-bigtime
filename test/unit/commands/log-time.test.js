const vscode = require('vscode')

const momnent = require('moment')
const bigTime = require('../../../bigtime')
const logTime = require('../../../commands/log-time')

describe('Commands', () => {

  describe('logTime', () => {

    it('returns a function', () => {
      expect(typeof logTime()).toBe('function')
    })

    describe('when not logged in', () => {

      let isLoggedInSpy

      beforeEach(() => {
        isLoggedInSpy = jest.spyOn(bigTime, 'isLoggedIn').mockImplementation(() => false)
      })

      afterEach(() => {
        isLoggedInSpy.mockRestore()
      })

      it('throws an error', async () => {
        await logTime()()
        expect(isLoggedInSpy).toHaveBeenCalled()
        expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Please login before continuing')
      })

    })

    describe('🙂 when logged in', () => {

      let isLoggedInSpy

      beforeEach(() => {
        isLoggedInSpy = jest.spyOn(bigTime, 'isLoggedIn').mockImplementation(() => true)
      })

      afterEach(() => {
        isLoggedInSpy.mockRestore()
      })

      describe('when fetching projects is unsuccessful', () => {

        let projectsPicklistSpy

        beforeEach(() => {
          projectsPicklistSpy = jest.spyOn(bigTime, 'projectsPicklist').mockImplementation(() => {
            throw new Error('foo')
          })
        })

        afterEach(() => {
          projectsPicklistSpy.mockRestore()
        })

        it('displays an error message', async () => {
          const context = {}
          const progress = {
            report: jest.fn()
          }
          vscode.window.withProgress = jest.fn().mockImplementation((options, cb) => {
            cb(progress)
          })
          await logTime(context)()
          expect(isLoggedInSpy).toHaveBeenCalled()
          expect(vscode.window.withProgress).toHaveBeenCalledWith({
            location: 1
          }, expect.anything())
          expect(progress.report).toHaveBeenCalledWith({message: 'Fetching projects...'})
          expect(projectsPicklistSpy).toHaveBeenCalled()
          expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('foo')
        })

      })

      describe('🙂 when fetching projects is successful', () => {

        let projectsPicklistSpy

        beforeEach(() => {
          projectsPicklistSpy = jest.spyOn(bigTime, 'projectsPicklist').mockImplementation(() => {})
        })

        afterEach(() => {
          projectsPicklistSpy.mockRestore()
        })

        describe('when a default project has been set', () => {

          describe('when the default project is invalid', () => {

            it('shows a quick pick dialog of projects', async () => {
              const context = {
                globalState: {
                  get: jest.fn()
                    // Project
                    .mockImplementationOnce(() => {
                      return {
                        label: 'Project Group 1 - Project Name 1',
                        value: 99 // Doesn't exist
                      }
                    })
                }
              }
              const progress = {
                report: jest.fn()
              }
              vscode.window.showQuickPick = jest.fn()
                .mockImplementationOnce(() => {
                  return {
                    label: 'Project Group 3 - Project Name 3',
                    value: 123
                  }
                })
              vscode.window.withProgress = jest.fn()
                // bigTime.projectsPicklist
                .mockImplementationOnce((options, cb) => {
                  cb(progress)
                  return {
                    body: [
                      {
                        Id: 1,
                        Group: 'Project Group 1',
                        Name: 'Project Name 1'
                      },
                      {
                        Id: 2,
                        Name: 'Project Name 2'
                      }
                    ]
                  }
                })
              const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
              const arrayFindSpy = jest.spyOn(Array.prototype, 'find')
              await logTime(context)()
              expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
              expect(progress.report).toHaveBeenNthCalledWith(1, {message: 'Fetching projects...'})
              expect(projectsPicklistSpy).toHaveBeenCalled()
              expect(arrayMapSpy).toHaveBeenCalledTimes(1)
              expect(context.globalState.get).toHaveBeenNthCalledWith(1, 'defaultProject')
              expect(arrayFindSpy).toHaveBeenCalledTimes(1)
              expect(vscode.window.showQuickPick).toHaveBeenNthCalledWith(1, [
                {label: 'Project Group 1 - Project Name 1', value: 1},
                {label: 'Project Name 2', value: 2}
              ])
            })

            describe('when no project is provided', () => {

              it('returns', async () => {
                const context = {
                  globalState: {
                    get: jest.fn()
                      // Project
                      .mockImplementationOnce(() => {
                        return {
                          label: 'Project Group 1 - Project Name 1',
                          value: 99 // Doesn't exist
                        }
                      })
                  }
                }
                const progress = {
                  report: jest.fn()
                }
                vscode.window.showQuickPick = jest.fn()
                  .mockImplementationOnce(() => {
                    return undefined
                  })
                vscode.window.withProgress = jest.fn()
                  // bigTime.projectsPicklist
                  .mockImplementationOnce((options, cb) => {
                    cb(progress)
                    return {
                      body: [
                        {
                          Id: 1,
                          Group: 'Project Group 1',
                          Name: 'Project Name 1'
                        },
                        {
                          Id: 2,
                          Name: 'Project Name 2'
                        }
                      ]
                    }
                  })
                const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
                const arrayFindSpy = jest.spyOn(Array.prototype, 'find')
                await logTime(context)()
                expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
                expect(progress.report).toHaveBeenNthCalledWith(1, {message: 'Fetching projects...'})
                expect(projectsPicklistSpy).toHaveBeenCalled()
                expect(arrayMapSpy).toHaveBeenCalledTimes(1)
                expect(context.globalState.get).toHaveBeenNthCalledWith(1, 'defaultProject')
                expect(arrayFindSpy).toHaveBeenCalledTimes(1)
                expect(vscode.window.showQuickPick).toHaveBeenNthCalledWith(1, [
                  {label: 'Project Group 1 - Project Name 1', value: 1},
                  {label: 'Project Name 2', value: 2}
                ])
              })

            })

          })
        })

        describe('when fetching categories is unsuccessful', () => {

          let categoriesPicklistSpy

          beforeEach(() => {
            categoriesPicklistSpy = jest.spyOn(bigTime, 'laborCodesPicklist').mockImplementation(() => {
              throw new Error('foo')
            })
          })

          afterEach(() => {
            categoriesPicklistSpy.mockRestore()
          })

          it('displays an error message', async () => {
            const context = {
              globalState: {
                get: jest.fn()
                  // Project
                  .mockImplementationOnce(() => {
                    return {
                      label: 'Project Group 1 - Project Name 1',
                      value: 1
                    }
                  })
              }
            }
            const progress = {
              report: jest.fn()
            }
            vscode.window.withProgress = jest.fn()
              // bigTime.projectsPicklist
              .mockImplementationOnce((options, cb) => {
                cb(progress)
                return {
                  body: [
                    {
                      Id: 1,
                      Group: 'Project Group 1',
                      Name: 'Project Name 1'
                    },
                    {
                      Id: 2,
                      Name: 'Project Name 2'
                    }
                  ]
                }
              })
              // bigTime.laborCodesPicklist
              .mockImplementationOnce((options, cb) => {
                cb(progress)
              })
            const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
            const arrayFindSpy = jest.spyOn(Array.prototype, 'find')
            await logTime(context)()
            expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
            expect(progress.report).toHaveBeenNthCalledWith(1, {message: 'Fetching projects...'})
            expect(projectsPicklistSpy).toHaveBeenCalled()
            expect(arrayMapSpy).toHaveBeenCalledTimes(1)
            expect(context.globalState.get).toHaveBeenNthCalledWith(1, 'defaultProject')
            expect(arrayFindSpy).toHaveBeenCalledTimes(1)
            // expect(vscode.window.showQuickPick).toHaveBeenCalledWith(projects)
            // expect(vscode.window.showInputBox).toHaveBeenCalledWith(projects)
            expect(vscode.window.withProgress).toHaveBeenNthCalledWith(2, {location: 1}, expect.anything())
            expect(progress.report).toHaveBeenNthCalledWith(2, {message: 'Fetching categories...'})
            expect(categoriesPicklistSpy).toHaveBeenCalled()
            // expect(context.globalState.get).toHaveBeenNthCalledWith(2, 'defaultCategory')
            // expect(context.globalState.get).toHaveBeenNthCalledWith(3, 'defaultHours')
            // expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(1, {
            //   prompt: 'Date',
            //   value: '2019-07-31'
            // })
            // expect(vscode.window.withProgress).toHaveBeenNthCalledWith(3, {location: 1}, expect.anything())
            // expect(progress.report).toHaveBeenNthCalledWith(3, {message: 'Submitting...'})
            // expect(createTimeEntrySpy).toHaveBeenCalledWith({
            //   Dt: '2019-06-30',
            //   ProjectSID: 1,
            //   BudgCatID: 1,
            //   Hours_IN: 8,
            //   Notes: 'Created using VS Code'
            // })
            expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('foo')
          })

        })

        describe('🙂 when fetching categories is successful', () => {

          let categoriesPicklistSpy

          beforeEach(() => {
            categoriesPicklistSpy = jest.spyOn(bigTime, 'laborCodesPicklist').mockImplementation(() => {})
          })

          afterEach(() => {
            categoriesPicklistSpy.mockRestore()
          })

          describe('when a default category has been set', () => {

            describe('when the default category is invalid', () => {

              it('shows a quick pick dialog of categories', async () => {
                const context = {
                  globalState: {
                    get: jest.fn()
                      // Project
                      .mockImplementationOnce(() => {
                        return {
                          label: 'Project Group 1 - Project Name 1',
                          value: 1
                        }
                      })
                      // Category
                      .mockImplementationOnce(() => {
                        return {
                          label: 'Category Group 1 - Category Name 1',
                          value: 99 // Doesn't exist
                        }
                      })
                  }
                }
                const progress = {
                  report: jest.fn()
                }
                vscode.window.showQuickPick = jest.fn()
                  .mockImplementationOnce(() => {
                    return {
                      label: 'Category Group 3 - Category Name 3',
                      value: 123
                    }
                  })
                vscode.window.withProgress = jest.fn()
                  // bigTime.projectsPicklist
                  .mockImplementationOnce((options, cb) => {
                    cb(progress)
                    return {
                      body: [
                        {
                          Id: 1,
                          Group: 'Project Group 1',
                          Name: 'Project Name 1'
                        },
                        {
                          Id: 2,
                          Name: 'Project Name 2'
                        }
                      ]
                    }
                  })
                  // bigTime.laborCodesPicklist
                  .mockImplementationOnce((options, cb) => {
                    cb(progress)
                    return {
                      body: [
                        {
                          Id: 1,
                          Group: 'Category Group 1',
                          Name: 'Category Name 1'
                        },
                        {
                          Id: 2,
                          Name: 'Category Name 2'
                        }
                      ]
                    }
                  })
                const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
                const arrayFindSpy = jest.spyOn(Array.prototype, 'find')
                await logTime(context)()
                expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
                expect(progress.report).toHaveBeenNthCalledWith(1, {message: 'Fetching projects...'})
                expect(projectsPicklistSpy).toHaveBeenCalled()
                expect(arrayMapSpy).toHaveBeenCalledTimes(2)
                expect(context.globalState.get).toHaveBeenNthCalledWith(1, 'defaultProject')
                expect(arrayFindSpy).toHaveBeenCalledTimes(2)
                expect(vscode.window.showQuickPick).toHaveBeenNthCalledWith(1, [
                  {label: 'Category Group 1 - Category Name 1', value: 1},
                  {label: 'Category Name 2', value: 2}
                ])
              })

              describe('when no category is provided', () => {

                it('returns', async () => {
                  const context = {
                    globalState: {
                      get: jest.fn()
                        // Project
                        .mockImplementationOnce(() => {
                          return {
                            label: 'Project Group 1 - Project Name 1',
                            value: 1
                          }
                        })
                        // Category
                        .mockImplementationOnce(() => {
                          return {
                            label: 'Category Group 1 - Category Name 1',
                            value: 99 // Doesn't exist
                          }
                        })
                    }
                  }
                  const progress = {
                    report: jest.fn()
                  }
                  vscode.window.showQuickPick = jest.fn()
                    .mockImplementationOnce(() => {
                      return undefined
                    })
                  vscode.window.withProgress = jest.fn()
                    // bigTime.projectsPicklist
                    .mockImplementationOnce((options, cb) => {
                      cb(progress)
                      return {
                        body: [
                          {
                            Id: 1,
                            Group: 'Project Group 1',
                            Name: 'Project Name 1'
                          },
                          {
                            Id: 2,
                            Name: 'Project Name 2'
                          }
                        ]
                      }
                    })
                    // bigTime.laborCodesPicklist
                    .mockImplementationOnce((options, cb) => {
                      cb(progress)
                      return {
                        body: [
                          {
                            Id: 1,
                            Group: 'Category Group 1',
                            Name: 'Category Name 1'
                          },
                          {
                            Id: 2,
                            Name: 'Category Name 2'
                          }
                        ]
                      }
                    })
                  const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
                  const arrayFindSpy = jest.spyOn(Array.prototype, 'find')
                  await logTime(context)()
                  expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
                  expect(progress.report).toHaveBeenNthCalledWith(1, {message: 'Fetching projects...'})
                  expect(projectsPicklistSpy).toHaveBeenCalled()
                  expect(arrayMapSpy).toHaveBeenCalledTimes(2)
                  expect(context.globalState.get).toHaveBeenNthCalledWith(1, 'defaultProject')
                  expect(arrayFindSpy).toHaveBeenCalledTimes(2)
                  expect(vscode.window.showQuickPick).toHaveBeenNthCalledWith(1, [
                    {label: 'Category Group 1 - Category Name 1', value: 1},
                    {label: 'Category Name 2', value: 2}
                  ])
                })

              })

            })

          })

          describe('when default hours have been set', () => {

            describe('when the default hours are invalid', () => {

              it('shows an input box', async () => {
                const context = {
                  globalState: {
                    get: jest.fn()
                      // Project
                      .mockImplementationOnce(() => {
                        return {
                          label: 'Project Group 1 - Project Name 1',
                          value: 1
                        }
                      })
                      // Category
                      .mockImplementationOnce(() => {
                        return {
                          label: 'Category Group 1 - Category Name 1',
                          value: 1
                        }
                      })
                      // Hours
                      .mockImplementationOnce(() => {
                        return false
                      })
                  }
                }
                const progress = {
                  report: jest.fn()
                }
                vscode.window.showInputBox = jest.fn()
                vscode.window.withProgress = jest.fn()
                  // bigTime.projectsPicklist
                  .mockImplementationOnce((options, cb) => {
                    cb(progress)
                    return {
                      body: [
                        {
                          Id: 1,
                          Group: 'Project Group 1',
                          Name: 'Project Name 1'
                        },
                        {
                          Id: 2,
                          Name: 'Project Name 2'
                        }
                      ]
                    }
                  })
                  // bigTime.laborCodesPicklist
                  .mockImplementationOnce((options, cb) => {
                    cb(progress)
                    return {
                      body: [
                        {
                          Id: 1,
                          Group: 'Category Group 1',
                          Name: 'Category Name 1'
                        },
                        {
                          Id: 2,
                          Name: 'Category Name 2'
                        }
                      ]
                    }
                  })
                const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
                const arrayFindSpy = jest.spyOn(Array.prototype, 'find')
                await logTime(context)()
                expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
                expect(progress.report).toHaveBeenNthCalledWith(1, {message: 'Fetching projects...'})
                expect(projectsPicklistSpy).toHaveBeenCalled()
                expect(context.globalState.get).toHaveBeenNthCalledWith(1, 'defaultProject')
                expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
                expect(progress.report).toHaveBeenNthCalledWith(2, {message: 'Fetching categories...'})
                expect(categoriesPicklistSpy).toHaveBeenCalled()
                expect(context.globalState.get).toHaveBeenNthCalledWith(2, 'defaultCategory')
                expect(arrayMapSpy).toHaveBeenCalledTimes(2)
                expect(arrayFindSpy).toHaveBeenCalledTimes(2)
                expect(context.globalState.get).toHaveBeenNthCalledWith(3, 'defaultHours')
                expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(1, {prompt: 'Hours'})
              })

              describe('when no hours are provided', () => {

                it('returns', async () => {
                  const context = {
                    globalState: {
                      get: jest.fn()
                        // Project
                        .mockImplementationOnce(() => {
                          return {
                            label: 'Project Group 1 - Project Name 1',
                            value: 1
                          }
                        })
                        // Category
                        .mockImplementationOnce(() => {
                          return {
                            label: 'Category Group 1 - Category Name 1',
                            value: 1
                          }
                        })
                        // Hours
                        .mockImplementationOnce(() => {
                          return false
                        })
                    }
                  }
                  const progress = {
                    report: jest.fn()
                  }
                  vscode.window.showInputBox = jest.fn()
                    .mockImplementation(() => undefined)
                  vscode.window.withProgress = jest.fn()
                    // bigTime.projectsPicklist
                    .mockImplementationOnce((options, cb) => {
                      cb(progress)
                      return {
                        body: [
                          {
                            Id: 1,
                            Group: 'Project Group 1',
                            Name: 'Project Name 1'
                          },
                          {
                            Id: 2,
                            Name: 'Project Name 2'
                          }
                        ]
                      }
                    })
                    // bigTime.laborCodesPicklist
                    .mockImplementationOnce((options, cb) => {
                      cb(progress)
                      return {
                        body: [
                          {
                            Id: 1,
                            Group: 'Category Group 1',
                            Name: 'Category Name 1'
                          },
                          {
                            Id: 2,
                            Name: 'Category Name 2'
                          }
                        ]
                      }
                    })
                  const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
                  const arrayFindSpy = jest.spyOn(Array.prototype, 'find')
                  await logTime(context)()
                  expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
                  expect(progress.report).toHaveBeenNthCalledWith(1, {message: 'Fetching projects...'})
                  expect(projectsPicklistSpy).toHaveBeenCalled()
                  expect(context.globalState.get).toHaveBeenNthCalledWith(1, 'defaultProject')
                  expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
                  expect(progress.report).toHaveBeenNthCalledWith(2, {message: 'Fetching categories...'})
                  expect(categoriesPicklistSpy).toHaveBeenCalled()
                  expect(context.globalState.get).toHaveBeenNthCalledWith(2, 'defaultCategory')
                  expect(arrayMapSpy).toHaveBeenCalledTimes(2)
                  expect(arrayFindSpy).toHaveBeenCalledTimes(2)
                  expect(context.globalState.get).toHaveBeenNthCalledWith(3, 'defaultHours')
                  expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(1, {prompt: 'Hours'})
                })

              })

            })

          })

          describe('🙂 when creating a time entry is successful', () => {

            let createTimeEntrySpy

            beforeEach(() => {
              createTimeEntrySpy = jest.spyOn(bigTime, 'createTimeEntry').mockImplementation(() => {})
            })

            afterEach(() => {
              createTimeEntrySpy.mockRestore()
            })

            it('🙂 shows an informational message', async () => {
              const context = {
                globalState: {
                  get: jest.fn()
                    // Project
                    .mockImplementationOnce(() => {
                      return {
                        label: 'Project Group 1 - Project Name 1',
                        value: 1
                      }
                    })
                    // Category
                    .mockImplementationOnce(() => {
                      return {
                        label: 'Category Group 1 - Category Name 1',
                        value: 1
                      }
                    })
                    // Hours
                    .mockImplementationOnce(() => {
                      return 8
                    })
                }
              }
              const progress = {
                report: jest.fn()
              }
              vscode.window.showInputBox = jest.fn()
                .mockImplementationOnce(() => '2019-06-30')
              vscode.window.withProgress = jest.fn()
                // bigTime.projectsPicklist
                .mockImplementationOnce((options, cb) => {
                  cb(progress)
                  return {
                    body: [
                      {
                        Id: 1,
                        Group: 'Project Group 1',
                        Name: 'Project Name 1'
                      },
                      {
                        Id: 2,
                        Name: 'Project Name 2'
                      }
                    ]
                  }
                })
                // bigTime.laborCodesPicklist
                .mockImplementationOnce((options, cb) => {
                  cb(progress)
                  return {
                    body: [
                      {
                        Id: 1,
                        Group: 'Category Group 1',
                        Name: 'Category Name 1'
                      },
                      {
                        Id: 2,
                        Name: 'Category Name 2'
                      }
                    ]
                  }
                })
                // bigTime.createTimeEntry
                .mockImplementationOnce((options, cb) => {
                  cb(progress)
                })
              const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
              const arrayFindSpy = jest.spyOn(Array.prototype, 'find')
              await logTime(context)()
              expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
              expect(progress.report).toHaveBeenNthCalledWith(1, {message: 'Fetching projects...'})
              expect(projectsPicklistSpy).toHaveBeenCalled()
              expect(arrayMapSpy).toHaveBeenCalledTimes(2)
              expect(context.globalState.get).toHaveBeenNthCalledWith(1, 'defaultProject')
              expect(arrayFindSpy).toHaveBeenCalledTimes(2)
              // expect(vscode.window.showQuickPick).toHaveBeenCalledWith(projects)
              // expect(vscode.window.showInputBox).toHaveBeenCalledWith(projects)
              expect(vscode.window.withProgress).toHaveBeenNthCalledWith(2, {location: 1}, expect.anything())
              expect(progress.report).toHaveBeenNthCalledWith(2, {message: 'Fetching categories...'})
              expect(categoriesPicklistSpy).toHaveBeenCalled()
              expect(context.globalState.get).toHaveBeenNthCalledWith(2, 'defaultCategory')
              expect(context.globalState.get).toHaveBeenNthCalledWith(3, 'defaultHours')
              expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(1, {
                prompt: 'Date',
                value: '2019-07-31'
              })
              expect(vscode.window.withProgress).toHaveBeenNthCalledWith(3, {location: 1}, expect.anything())
              expect(progress.report).toHaveBeenNthCalledWith(3, {message: 'Submitting...'})
              expect(createTimeEntrySpy).toHaveBeenCalledWith({
                Dt: '2019-06-30',
                ProjectSID: 1,
                BudgCatID: 1,
                Hours_IN: 8,
                Notes: 'Created using VS Code'
              })
              expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Successfully logged 8 hours for Project Group 1 - Project Name 1')
            })

          })

          describe('when creating a time entry is unsuccessful', () => {

            let createTimeEntrySpy

            beforeEach(() => {
              createTimeEntrySpy = jest.spyOn(bigTime, 'createTimeEntry').mockImplementation(() => {
                throw new Error('foo')
              })
            })

            afterEach(() => {
              createTimeEntrySpy.mockRestore()
            })

            it('shows an error message', async () => {
              const context = {
                globalState: {
                  get: jest.fn()
                    // Project
                    .mockImplementationOnce(() => {
                      return {
                        label: 'Project Group 1 - Project Name 1',
                        value: 1
                      }
                    })
                    // Category
                    .mockImplementationOnce(() => {
                      return {
                        label: 'Category Group 1 - Category Name 1',
                        value: 1
                      }
                    })
                    // Hours
                    .mockImplementationOnce(() => {
                      return 8
                    })
                }
              }
              const progress = {
                report: jest.fn()
              }
              vscode.window.showInputBox = jest.fn()
                .mockImplementationOnce(() => '2019-06-30')
              vscode.window.withProgress = jest.fn()
                // bigTime.projectsPicklist
                .mockImplementationOnce((options, cb) => {
                  cb(progress)
                  return {
                    body: [
                      {
                        Id: 1,
                        Group: 'Project Group 1',
                        Name: 'Project Name 1'
                      },
                      {
                        Id: 2,
                        Name: 'Project Name 2'
                      }
                    ]
                  }
                })
                // bigTime.laborCodesPicklist
                .mockImplementationOnce((options, cb) => {
                  cb(progress)
                  return {
                    body: [
                      {
                        Id: 1,
                        Group: 'Category Group 1',
                        Name: 'Category Name 1'
                      },
                      {
                        Id: 2,
                        Name: 'Category Name 2'
                      }
                    ]
                  }
                })
                // bigTime.createTimeEntry
                .mockImplementationOnce((options, cb) => {
                  cb(progress)
                })
              const arrayMapSpy = jest.spyOn(Array.prototype, 'map')
              const arrayFindSpy = jest.spyOn(Array.prototype, 'find')
              await logTime(context)()
              expect(vscode.window.withProgress).toHaveBeenNthCalledWith(1, {location: 1}, expect.anything())
              expect(progress.report).toHaveBeenNthCalledWith(1, {message: 'Fetching projects...'})
              expect(projectsPicklistSpy).toHaveBeenCalled()
              expect(arrayMapSpy).toHaveBeenCalledTimes(2)
              expect(context.globalState.get).toHaveBeenNthCalledWith(1, 'defaultProject')
              expect(arrayFindSpy).toHaveBeenCalledTimes(2)
              // expect(vscode.window.showQuickPick).toHaveBeenCalledWith(projects)
              // expect(vscode.window.showInputBox).toHaveBeenCalledWith(projects)
              expect(vscode.window.withProgress).toHaveBeenNthCalledWith(2, {location: 1}, expect.anything())
              expect(progress.report).toHaveBeenNthCalledWith(2, {message: 'Fetching categories...'})
              expect(categoriesPicklistSpy).toHaveBeenCalled()
              expect(context.globalState.get).toHaveBeenNthCalledWith(2, 'defaultCategory')
              expect(context.globalState.get).toHaveBeenNthCalledWith(3, 'defaultHours')
              expect(vscode.window.showInputBox).toHaveBeenNthCalledWith(1, {
                prompt: 'Date',
                value: '2019-07-31'
              })
              expect(vscode.window.withProgress).toHaveBeenNthCalledWith(3, {location: 1}, expect.anything())
              expect(progress.report).toHaveBeenNthCalledWith(3, {message: 'Submitting...'})
              expect(createTimeEntrySpy).toHaveBeenCalledWith({
                Dt: '2019-06-30',
                ProjectSID: 1,
                BudgCatID: 1,
                Hours_IN: 8,
                Notes: 'Created using VS Code'
              })
              expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('foo')
            })

          })

        })

      })

    })

  })

})
