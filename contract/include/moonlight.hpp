#include <eosio/eosio.hpp>
#include <eosio/print.hpp>
#include <eosio/asset.hpp>
#include <eosio/transaction.hpp>
#include <eosio/crypto.hpp>
#include <eosio/singleton.hpp>
#include <string>
using namespace eosio;
using std::string;
CONTRACT moonlight : public contract
{
public:
  using contract::contract;

  ACTION paybyowner(name username);
  ACTION paybyuser(name username);
  bool accept_charges(
    uint32_t max_net_usage_words,   // Maximum NET usage to charge
    uint32_t max_cpu_usage_ms       // Maximum CPU usage to charge
);

private:
  TABLE profile
  {
    name username;
    time_point_sec lastlogin;

    uint64_t primary_key() const { return username.value; }
  };

  typedef eosio::multi_index<"profiletab"_n, profile> profile_tab;

  using paybyowner_action = action_wrapper<"paybyowner"_n, &moonlight::paybyowner>;
  using paybyuser_action = action_wrapper<"paybyuser"_n, &moonlight::paybyuser>;
};
